import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { UserService } from '../user.service';


@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private apiUrl = 'http://localhost:8080';


  constructor(private http: HttpClient , private userService:UserService) { }


  loginWithGoogle(): void {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  handleGoogleCallback(): void {
    this.http.get<any>(`${this.apiUrl}/auth/google/callback`).subscribe(
      (response) => {
        console.log('giriş başarılı', response);
        this.userService.loginUserWithEmail(response).subscribe(()=>{
          console.log('google service conf başarılı');
        })
      },
      (error) => {
        console.error('Giriş başarısız', error);
      }
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
