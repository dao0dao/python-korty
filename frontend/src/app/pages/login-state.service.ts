import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class LoginStateService {
  constructor(private router: Router) {}

  private isLogin: boolean = false;
  private isAdmin: boolean = false;
  private user: string = '';

  public logIn(isAdmin: boolean, user: string) {
    this.isLogin = true;
    this.isAdmin = isAdmin;
    this.user = user;
  }

  public logOut() {
    this.isLogin = false;
    this.isAdmin = false;
    this.user = '';
    this.router.navigate(['/login']);
  }

  public get state() {
    return {
      isLogin: this.isLogin,
      isAdmin: this.isAdmin,
      user: this.user,
    };
  }
}
