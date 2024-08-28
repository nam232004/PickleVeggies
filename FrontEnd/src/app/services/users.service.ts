import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../models/users';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  url = 'http://localhost:3000/api';
  loggedIn = false;

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Users[]> {
    return this.httpClient.get<Users[]>(`${this.url}/users`);
  }

  get(id: number): Observable<Users> {
    return this.httpClient.get<Users>(`${this.url}/users/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete(`${this.url}/users/${id}`);
  }

  register(user: Users): Observable<Users> {
    return this.httpClient.post<Users>(`${this.url}/users/add`, user);
  }

  login(user: Users): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/users/login`, user, { withCredentials: true })
      .pipe(
        map(response => {
          localStorage.setItem('user_login', JSON.stringify(response));
          this.loggedIn = true;
          return response;
        })
      );
  }

  update(id: number, user: Users): Observable<any> {
    return this.httpClient.patch(`${this.url}/users/${id}`, user);
  }

  forgotPassword(data: { forgot_email: string }): Observable<Users> {
    return this.httpClient.post<Users>(`${this.url}/forgotPass`, data);
  }

  changePassword(token: string, newPassword: string): Observable<any> {
    return this.httpClient.post(`${this.url}/changePass/${token}`, { new_password: newPassword });
  }

  checkLogin(): boolean {
    const dataJson = localStorage.getItem('user_login');
    return dataJson ? JSON.parse(dataJson) : false;
  }

  checkAdmin(): boolean {
    const dataJson = localStorage.getItem('user_login');
    if (dataJson) {
      const user = JSON.parse(dataJson).user;
      return user && user.isAdmin === 1;
    }
    return false;
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let dataJson = localStorage.getItem('user_login');
      resolve(!!dataJson);
    });
  }

  isAdmin(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const dataJson = localStorage.getItem('user_login');
      if (dataJson) {
        const user = JSON.parse(dataJson).user;
        this.loggedIn = user && user.isAdmin === 1;
        resolve(this.loggedIn);
      } else {
        resolve(false);
      }
    });
  }
  

  getAccessToken(): string | null {
    const dataJson = localStorage.getItem('user_login');  
    return dataJson ? JSON.parse(dataJson).accessToken : null;
  }

  getRefreshToken(): string | null {
    const dataJson = localStorage.getItem('user_login');
    return dataJson ? JSON.parse(dataJson).refreshToken : null;
  }
}
