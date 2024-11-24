import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginStateService } from './login-state.service';

interface Login {
  isLogin: boolean;
  isAdmin: boolean;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class IsLoginGuard implements CanActivate {

  private isLogin: boolean = false;

  constructor(private http: HttpClient, private router: Router, private loginStateService: LoginStateService) { };

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.isLogin = this.loginStateService.state.isLogin;
    if (!this.isLogin) {
      this.http.get<Login>(environment.apiLink + 'login').subscribe({
        next: (res: Login) => {
          this.loginStateService.logIn(res.isAdmin, res.user);
          return true;
        },
        error: (err) => {
          this.loginStateService.logOut();
          return false;
        }
      });
    }
    return true;
  }

  logOut() {
    this.isLogin = false;
    this.router.navigate(['/login']);
  }

}
