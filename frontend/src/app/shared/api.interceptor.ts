import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IsLoginGuard } from '../pages/is-login.guard';
import { InfoService } from '../info.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private isLoginGuard: IsLoginGuard,
    private infoService: InfoService,
    private cookieService: CookieService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const csrfToken = this.cookieService.get('csrftoken');
    const cloneReq = request.clone({
      withCredentials: environment.production ? false : true
    });
    return next.handle(cloneReq).pipe(
      catchError((err) =>
        throwError(() => {
          if (err.status === 401) {
            if (err.error.session === 'fail') {
              this.infoService.showInfo('Sesja wygasła');
            }
            if (err.error.notAllowed) {
              this.infoService.showInfo('Brak dostępu');
            }
            if (err.error.unExistUser) {
              this.infoService.showInfo('Konto nie istnieje');
            }
            this.isLoginGuard.logOut();
          }
          if (err.status === 403) {
            this.infoService.showInfo('Brak dostępu');
            this.isLoginGuard.logOut();
          }
          if (err.status === 406) {
            this.infoService.showInfo(err.error.reason);
          }
          if (err.status === 500) {
            if (err.error.readWrite === 'fail') {
              this.infoService.showInfo('Błąd odczytu/zapisu bazy danych');
            }
          }
          return err;
        })
      )
    );
  }
}
