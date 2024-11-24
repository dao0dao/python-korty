import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<User>(environment.apiLink + 'user');
  }

  getListOfUsers() {
    return this.http.get<{ users: User[] }>(
      environment.apiLink + 'user/list'
    );
  }

  updateLoginUser(body: User): Observable<any> {
    return this.http.post(environment.apiLink + 'user', body);
  }

  createUser(body: User): Observable<any> {
    return this.http.post(environment.apiLink + 'user/create', body);
  }

  updateUser(body: User) {
    return this.http.post<{ update: true }>(
      environment.apiLink + 'user/update/' + body.id,
      body
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<{ deleted: boolean }>(
      environment.apiLink + 'user/delete/' + id
    );
  }
}
