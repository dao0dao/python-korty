import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class RefreshGuard implements CanActivateChild {
  private refreshUrl: string = '';

  constructor(private router: Router) { }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.refreshUrl == '') {
      this.refreshUrl = state.url;
      this.router.navigate([this.refreshUrl]);
    }
    return true;
  }

}
