import { Injectable } from '@angular/core';
import * as JWT from 'jwt-decode';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UserRole } from 'src/app/models/role.enum';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isauth: boolean = false;

  private userRoleSubject = new BehaviorSubject<UserRole>(UserRole.User);

  private authTokenKey = 'authToken';

  private authTokenExpirationKey = 'authTokenExpiration';

  constructor() {}

  public getUserRole(): BehaviorSubject<UserRole> {
    return this.userRoleSubject;
  }

  // public decodeToken() {
  //   // LocalStorage'tan token'ı al veya boş bir string kullan
  //   const token = localStorage.getItem(this.authTokenKey) || '';
  
  //   // Eğer token varsa
  //   if (token) {
  //     try {
  //       // Token'ı çöz ve içeriğini al
  //       let decoded = JWT.jwtDecode(token);
  
  //       // Token'ın süresini temsil eden "exp" (expiration) değerini al
  //       let expDate = new Date();
  //       expDate.setTime(decoded['exp'] * 1000); // UNIX zaman damgası cinsinden saniye cinsinden tarih
  
  //       // Eğer şu anki zaman, token'ın geçerlilik süresini aşıyorsa
  //       if (new Date().getTime() > expDate.getTime()) {
  //         // Token'ı localStorage'tan kaldır
  //         localStorage.removeItem(this.authTokenKey);
  //         // null değeri döndür (token geçersiz olduğu için)
  //         return null;
  //       }
  
  //       // Token geçerli ise, çözülmüş token'ı döndür
  //       return decoded;
  //     } catch (err) {
  //       // Token çözme sırasında bir hata olursa, hatayı konsola yazdır
  //       console.error('Error while decoding the token', err);
  //     }
  //   }
  
  //   // Eğer token yoksa veya bir hata oluşmuşsa null döndür
  //   return null;
  // }
  

  public isAuth(): boolean {
    return this.isauth;
  }

  public login(): void {
    this.isauth = true;
  }

  public logout(): void {
    this.isauth = false;
    localStorage.clear();
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

  public isAuthenticated():boolean {
     // LocalStorage'tan token'ı al veya boş bir string kullan
     const token = localStorage.getItem(this.authTokenKey) || '';
  
     // Eğer token varsa
     if (token) {
       try {
         // Token'ı çöz ve içeriğini al
         let decoded = JWT.jwtDecode(token);
   
         // Token'ın süresini temsil eden "exp" (expiration) değerini al
         let expDate = new Date();
         expDate.setTime(decoded['exp'] * 1000); // UNIX zaman damgası cinsinden saniye cinsinden tarih
   
         // Eğer şu anki zaman, token'ın geçerlilik süresini aşıyorsa
         if (new Date().getTime() > expDate.getTime()) {
           // Token'ı localStorage'tan kaldır
           localStorage.removeItem(this.authTokenKey);
           // null değeri döndür (token geçersiz olduğu için)
           return null;
         }
   
       } catch (err) {
         // Token çözme sırasında bir hata olursa, hatayı konsola yazdır
         console.error('Error while decoding the token', err);
       }
     }
   
     // Eğer token yoksa veya bir hata oluşmuşsa null döndür
     return null;
  }

 
}
