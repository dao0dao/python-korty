import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from 'src/environments/environment';
import { animations } from './animations';
import { InfoService } from './info.service';
import { LoginStateService } from './pages/login-state.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: animations
})
export class AppComponent implements OnInit {

  isMenu: boolean = false;
  isPayments: boolean = false;
  isActivePayments: boolean = false;

  constructor(
    public infoService: InfoService,
    private http: HttpClient,
    public loginState: LoginStateService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((res: any) => res?.routerEvent?.urlAfterRedirects)
    ).subscribe(res => {
      if (res.routerEvent.urlAfterRedirects.includes('price')) {
        this.isActivePayments = true;
      } else {
        this.isActivePayments = false;
      }
    });
  }

  toggleMenu() {
    this.isMenu = !this.isMenu;
    this.closeList();
  }

  togglePayments() {
    this.isPayments = !this.isPayments;
  }

  closeList() {
    this.isPayments = false;
  }

  logout() {
    this.http.get(environment.apiLink + 'logout').subscribe({
      next: (res) => {
        this.isMenu = false;
        this.loginState.logOut();
      },
      error: (err) => {
        this.isMenu = false;
        this.loginState.logOut();
      }
    });
  }

}
