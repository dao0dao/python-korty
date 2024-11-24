import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { ApiService } from '../api.service';
import { User } from '../interfaces';

interface addErr extends Error {
  error: {
    canNotCreateUser: boolean,
    passwordDoesNotMatch: boolean;
  };
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  constructor(private fb: FormBuilder, private api: ApiService, private infoService: InfoService) { }

  addForm: FormGroup = new FormGroup({});
  samePassword: boolean = true;
  blockSubmit: boolean = false;

  get name() {
    return this.addForm.get('name');
  }
  get login() {
    return this.addForm.get('login');
  }
  get password() {
    return this.addForm.get('password');
  }
  get confirmPassword() {
    return this.addForm.get('confirmPassword');
  }

  submit() {
    this.blockSubmit = true;
    const body: User = {
      name: this.name?.value,
      login: this.login?.value,
      password: this.password?.value,
      confirmPassword: this.confirmPassword?.value
    };
    this.api.createUser(body).subscribe({
      next: () => {
        this.addForm.reset();
        this.infoService.showInfo('Stworzono użytkownika', true);
        this.blockSubmit = false;
      },
      error: (err: addErr) => {
        const { error } = err;
        if (error.canNotCreateUser) {
          this.addForm.reset();
          this.infoService.showInfo('Taki użytkownik już istnieje');
        }
        if (error.passwordDoesNotMatch) {
          this.infoService.showInfo('Hasła nie są identyczne');
        }
        this.blockSubmit = false;
      }
    });
  }

  checkPassword() {
    if (this.password?.value !== this.confirmPassword?.value) {
      this.samePassword = false;
    } else {
      this.samePassword = true;
    }
  }

  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    });
  }

}
