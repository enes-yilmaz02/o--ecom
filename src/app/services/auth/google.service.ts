import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient) { }


  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  handleGoogleCallback(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/auth/google/callback`).pipe(
      tap((response) => {
        console.log('giriş başarılı', response);
        localStorage.setItem('token', response.token); // Token bilgisini sakla
      })
    );
  }

  // Optional: Check if the user is authenticated
  isAuthenticated(): Observable<boolean>{
    const token = localStorage.getItem('token');

    if (token) {
      // Token varsa ve geçerliyse true döndür
      // Token'ın geçerliliğini backend'de kontrol etmek daha güvenlidir
      return of(true);
    } else {
      return of(false);
    }
  }
}
