import { Injectable } from '@angular/core';
import * as JWT from 'jwt-decode';
import { Router } from 'express';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private auth: boolean = false;

  private authTokenKey = 'authToken';
  
  private authTokenExpirationKey = 'authTokenExpiration';

  constructor(private router:Router) {}
  public decodeToken() {
    const token = localStorage.getItem(this.authTokenKey) || '';
    if (token) {
      try {
        // Decode the token
        let decoded = JWT.jwtDecode(token);
        
        // Get the expiration time from the token
        let expDate = new Date(decoded['exp'] * 1000); // Convert from UNIX timestamp to JavaScript timestamp
        
        let nowDate= new Date();

        let tokenInfo = [ decoded , expDate , nowDate ];
        // If the token is expired, remove it and return null
        if (nowDate.getTime() > expDate.getTime()) {
          this.logout();
          return null;
        }
        else{
          this.isAuth();
          return tokenInfo ;
        }
      } catch (err) {
        console.error('Error while decoding the token', err);
      }
    }

    // If there's no token, or an error occurred, return null
    return null;
  }

 

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

  public isAuthenticated(): boolean {
    const authToken = this.getAuthToken();
    const expirationDate = this.getAuthTokenExpiration();

    if (authToken && expirationDate) {
      const now = new Date().getTime();
      const expirationTime = new Date(expirationDate).getTime();

      // Return true only if the token is not expired
      return expirationTime > now;
    }

    // If there's no token or expiration date, or the token is expired, return false
    return false;
  }
 
}
