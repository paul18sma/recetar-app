import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@root/environments/environment';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
// inteface
import { Tokens } from '@auth/models/tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly apiEndPoint = environment.API_END_POINT;
  private loggedUser: string;
  private loggedIn: BehaviorSubject<boolean>;


  constructor(private http: HttpClient) {
    this.loggedIn = new BehaviorSubject<boolean>(!!this.getJwtToken());
  }

  // signUp(user): Observable<any>{
    // return this.http.post<any>(`${config.apiUrl}/auth/register`, user);
    // }

    login(user: { username: string, password: string }): Observable<boolean | HttpErrorResponse> {
      return this.http.post<any>(`${this.apiEndPoint}/auth/login`, user).pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true)
        );
      }

      logout() {
        return this.http.post<any>(`${this.apiEndPoint}/auth/logout`, {
          'refreshToken': this.getRefreshToken()
        }).pipe(
          tap(() => this.doLogoutUser()),
          mapTo(true),
      catchError(error => {
        console.log(error.error);
        return of(false);
      }));
    }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiEndPoint}/auth/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getLoggedUsername(): string{
    return this.loggedUser;
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
    this.loggedIn.next(!!this.getJwtToken());
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
    this.loggedIn.next(!!this.getJwtToken());
  }

  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens) {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}




