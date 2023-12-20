import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private auth: boolean = false;

  private authTokenKey = 'authToken';

  private authTokenExpirationKey = 'authTokenExpiration';

  constructor() {}



  public isAuth(): boolean {
    return this.auth;
  }

  public login(): void {
      this.auth = true;
  }

  public logout(): void {
    this.removeAuthToken();
    this.auth = false;
  }

  public setAuthToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  public getAuthToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  public setAuthTokenExpiration(expirationDate: string): void {
    localStorage.setItem(this.authTokenExpirationKey, expirationDate);
  }

  public getAuthTokenExpiration(): string | null {
    return localStorage.getItem(this.authTokenExpirationKey);
  }

  public removeAuthToken(): void {
    localStorage.removeItem(this.authTokenKey);
    localStorage.removeItem(this.authTokenExpirationKey);
  }
}
