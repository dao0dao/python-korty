import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InfoService } from 'src/app/info.service';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api.service';
import { User } from '../interfaces';

interface userError extends Error {
  error: {
    id: boolean;
    name: boolean;
    login: boolean;
    newPassword: boolean;
    confirmNewPassword: boolean;
    reservedLogin: boolean;
  };
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private infoService: InfoService
  ) {}

  users: User[] = [];

  isPopUp: boolean = false;
  isDeletePupUp: boolean = false;
  samePassword: boolean = true;
  blockSubmit: boolean = false;
  environment = environment;

  editForm: FormGroup = new FormGroup({});
  get name() {
    return this.editForm.get('name');
  }
  get login() {
    return this.editForm.get('login');
  }
  get password() {
    return this.editForm.get('password');
  }
  get confirmPassword() {
    return this.editForm.get('confirmPassword');
  }

  deleteId: string = '';
  deletedName: string = '';

  setForm(id: string = '', name: string, login: string) {
    this.editForm = this.fb.group({
      id: [id],
      name: [
        name,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      login: [
        login,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
      password: [''],
      confirmPassword: [''],
    });
  }

  openEditUser(user: User) {
    const { id, name, login } = user;
    this.setForm(id, name, login);
    this.isPopUp = true;
  }

  openDeleteUser(user: User) {
    this.deleteId = user.id || '';
    this.deletedName = user.name;
    this.isDeletePupUp = true;
  }

  closePopUp() {
    this.isPopUp = false;
    this.isDeletePupUp = false;
    this.deleteId = '';
    this.deletedName = '';
    this.editForm = new FormGroup({});
  }

  checkPassword() {
    if (this.password?.value || this.confirmPassword?.value) {
      this.password?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]);
      this.confirmPassword?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]);
      this.password?.value === this.confirmPassword?.value
        ? (this.samePassword = true)
        : (this.samePassword = false);
    } else {
      this.password?.clearValidators();
      this.confirmPassword?.clearValidators();
      this.samePassword = true;
    }
    this.password?.updateValueAndValidity();
    this.confirmPassword?.updateValueAndValidity();
  }

  loadListOfUsers() {
    this.api.getListOfUsers().subscribe({
      next: (res) => {
        this.users = res.users;
      },
    });
  }

  submitEdition() {
    this.blockSubmit = true;
    const user: User = {
      id: this.editForm.get('id')?.value,
      name: this.name?.value,
      login: this.login?.value,
      password: this.password?.value,
      confirmPassword: this.confirmPassword?.value,
    };
    this.api.updateUser(user).subscribe({
      next: () => {
        this.closePopUp();
        this.infoService.showInfo('Zaktualizowano konto', true);
        this.loadListOfUsers();
        this.blockSubmit = false;
      },
      error: (error: userError) => {
        const err = error.error;
        err.name ? this.name?.setErrors({ incorrect: true }) : null;
        err.login ? this.login?.setErrors({ incorrect: true }) : null;
        err.newPassword ? this.password?.setErrors({ incorrect: true }) : null;
        err.confirmNewPassword
          ? this.confirmPassword?.setErrors({ incorrect: true })
          : null;
        if (err.reservedLogin) {
          this.login?.reset();
          this.infoService.showInfo('Login zarezerwowany');
        }
        if (err.id === false) {
          this.closePopUp();
          this.infoService.showInfo('Brak id w bazie');
        }
        this.blockSubmit = false;
        this.editForm.updateValueAndValidity();
      },
    });
  }

  deleteUser() {
    this.blockSubmit = true;
    this.api.deleteUser(this.deleteId).subscribe({
      next: () => {
        this.infoService.showInfo('Usunięto użytkownika', true);
        this.closePopUp();
        this.loadListOfUsers();
        this.blockSubmit = false;
      },
      error: () => {
        this.infoService.showInfo('Niepowodzenie, brak id w bazie');
        this.closePopUp();
        this.loadListOfUsers();
        this.blockSubmit = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadListOfUsers();
  }
}
