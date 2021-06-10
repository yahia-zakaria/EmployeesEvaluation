import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
//injectable
//singleton:it survive while the app is running
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.baseUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }
  login(model: User) {
    return this.http.post(this.baseUrl + "account/login", model).pipe(map((response: any) => {
      const user = response;
      if (user) {
        this.setCurrentUser(user);
      }
      return user;

    }));
  }
  register(user: any) {
    return this.http.post(this.baseUrl + "account/register", user);
  }
  setCurrentUser(user: User) {
    user.roles = [];
    const _role = this.getDecodedToken(user.token).role;
    Array.isArray(_role) ? user.roles = _role : user.roles.push(_role);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);

  }
  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);

  }
  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }

  getUsersWithRoles() {
    return this.http.get<Partial<User[]>>(this.baseUrl + 'account/users-with-roles');
  }
  updateRoles(username: string, roles: string[]) {
    return this.http.post(this.baseUrl + 'account/edit-roles/' + username + '?roles=' + roles, {});
  }

  lockUser(username: string) {
    return this.http.put(this.baseUrl + 'account/activate/' + username, {});
  }
  getUser(username: string):Observable<User> {
    return this.http.get<User>(this.baseUrl + 'account/' + username);
  }
  updateUser(user: User) {
    return this.http.put(this.baseUrl + 'account/update-user', user);
  }
  changePassword(newPassword: any) {
    return this.http.post(this.baseUrl + 'account/change-password/' + newPassword, {});
  }
  resetPassword(username:string) {
    return this.http.put(this.baseUrl + 'account/reset-password/' +username , {});
  }
}
