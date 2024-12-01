import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfoService } from 'src/app/info.service';
import { environment } from 'src/environments/environment';
import { LoginStateService } from '../login-state.service';

interface Login {
  isLogin: boolean;
  isAdmin: boolean;
  user: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private infoService: InfoService,
    private router: Router,
    private loginStateService: LoginStateService
  ) {}

  loginForm: FormGroup = new FormGroup({});

  get nick() {
    return this.loginForm.get('nick');
  }

  get password() {
    return this.loginForm.get('password');
  }

  logIn() {
    this.http
      .post<Login>(environment.apiLink + 'login', {
        login: this.nick?.value,
        password: this.password?.value,
      })
      .subscribe({
        next: (res: Login) => {
          this.loginStateService.logIn(res.isAdmin, res.user);
          this.loginForm.reset();
          this.router.navigate(['/timetable']);
        },
        error: (err) => {
          this.infoService.showInfo('Błędny nick i/lub hasło');
          this.loginForm.reset();
        },
      });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nick: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.http.get<Login>(environment.apiLink + 'login').subscribe({
      next: (res: Login) => {
        if (res.isLogin) {
          this.loginStateService.logIn(res.isAdmin, res.user);
          this.loginForm.reset();
          this.router.navigate(['/timetable']);
        }
      },
    });
  }
}
