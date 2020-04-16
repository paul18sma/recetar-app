import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@root/environments/environment';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import decode from 'jwt-decode';

// inteface
import { Tokens } from '@auth/models/tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly apiEndPoint = environment.API_END_POINT;
  private loggedIn: BehaviorSubject<boolean>;


  constructor(private http: HttpClient) {
    this.loggedIn = new BehaviorSubject<boolean>(!!this.getJwtToken());
  }

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
      })
    );
  }

  resetPassword(passwords: {oldPassword: string, newPassword: string}){
    return this.http.post<any>(`${this.apiEndPoint}/auth/reset-password`, passwords);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiEndPoint}/auth/refresh`, {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap((tokens: Tokens) => {
        this.storeJwtToken(tokens.jwt);
      })
    );
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  getLoggedUsername(): string{
    const payLoadJwt: any = this.getDecodeJwt();
    return payLoadJwt.usrn;
  }

  getLoggedUserId(): string{
    const payLoadJwt: any = this.getDecodeJwt();
    return payLoadJwt.sub;
  }

  isPharmacistsRole(): boolean {
    const roles: string[] = this.getLoggedRole();
    return roles.some( (role: string) => role === 'pharmacist');
    // return this.getLoggedRole() === 'pharmacist';
  }

  isProfessionalRole(): boolean {
    const roles: string[] = this.getLoggedRole();
    return roles.some( (role: string) => role === 'professional');
    // return this.getLoggedRole() === 'professional';
  }

  getLoggedRole(): string[]{
    const payLoadJwt: any = this.getDecodeJwt();
    return payLoadJwt.rl;
  }

  private getDecodeJwt(){
    if(!!this.getJwtToken()){
      const token = this.getJwtToken();
      const tokenPayload = decode(token);
      return tokenPayload;
    }
    return false;
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.storeTokens(tokens);
    this.loggedIn.next(!!this.getJwtToken());
  }

  private doLogoutUser() {
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




