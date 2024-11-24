import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginStateService } from '../login-state.service';
import { ApiService } from './api.service';
import { User } from './interfaces';
import { InfoService } from '../../info.service';

type Overlap = 'user' | 'list' | 'add';

interface userError extends Error {
  error: {
    name: boolean,
    login: boolean,
    newPassword: boolean,
    passwordNotMatch: boolean;
    reservedLogin: boolean;
  };
}


@Component({
  selector: 'app-coaches',
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.scss']
})
export class CoachesComponent implements OnInit {

  constructor(public loginState: LoginStateService, private api: ApiService, private fb: FormBuilder, private infoService: InfoService) { }

  overlap: Overlap = 'user';
  user: User = {} as any;
  samePassword: boolean = true;
  blockSubmit: boolean = false;

  userForm: FormGroup = new FormGroup({});
  get name() { return this.userForm.get('name'); }
  get nick() { return this.userForm.get('nick'); }
  get newPassword() { return this.userForm.get('newPassword'); }
  get confirmNewPassword() { return this.userForm.get('confirmNewPassword'); }

  toggleList(tab: Overlap) {
    this.overlap = tab;
  }

  checkPassword() {
    if (this.newPassword?.value || this.confirmNewPassword?.value) {
      this.newPassword?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(15)]);
      this.confirmNewPassword?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(15)]);
      this.newPassword?.value === this.confirmNewPassword?.value ? this.samePassword = true : this.samePassword = false;
    } else {
      this.newPassword?.clearValidators();
      this.confirmNewPassword?.clearValidators();
      this.samePassword = true;
    }
    this.newPassword?.updateValueAndValidity();
    this.confirmNewPassword?.updateValueAndValidity();
  }

  submit() {
    this.blockSubmit = true;
    const body: User = {
      name: this.name?.value,
      login: this.nick?.value,
      newPassword: this.newPassword?.value,
      confirmNewPassword: this.confirmNewPassword?.value
    };
    this.api.updateLoginUser(body).subscribe({
      next: () => {
        this.infoService.showInfo('Zaktualizowano dane', true);
        this.newPassword?.reset();
        this.confirmNewPassword?.reset();
        this.checkPassword();
        this.blockSubmit = false;
      },
      error: (error: userError) => {
        const err = error.error;
        err.name  ? this.name?.setErrors({ incorrect: true }) : null;
        err.login ? this.nick?.setErrors({ incorrect: true }) : null;
        err.newPassword  ? this.newPassword?.setErrors({ incorrect: true }) : null;
        err.passwordNotMatch  ? this.confirmNewPassword?.setErrors({ incorrect: true }) : null;
        if (err.reservedLogin) {
          this.nick?.reset();
          this.infoService.showInfo('Login zarezerwowany');
        }
        this.blockSubmit = false;
      }
    });
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      nick: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
      newPassword: [''],
      confirmNewPassword: ['']
    });
    this.api.getUser().subscribe({
      next: (res) => {
        this.name?.setValue(res.name);
        this.nick?.setValue(res.login);
      }
    });
  }

}
