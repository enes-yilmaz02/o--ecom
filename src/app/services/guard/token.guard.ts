import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // Auth servisi örnek olarak, kullanılan servise göre değiştirilmelidir.

@Injectable({
  providedIn: 'root',
})
export class TokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

   const token = route.queryParams['token'] as string;
   if (!token) {
    console.error('Token not found in query parameters.');
    return of(false);
  } else {
    try {
      if(token){
        this.authService.setAuthToken(token);
      }
      return of(true);
    } catch (error) {
      console.error('Error while processing token:', error);
      return of(false);
    }
  }


  }
}
