import { MessageService } from 'primeng/api';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Kullanıcının oturum açıp açmadığını AuthService kullanarak kontrol ediyor
    if (this.authService.isAuth()) {
      return true; // Kullanıcı oturum açmışsa true döndürüyor
    } else {
      // Kullanıcı oturum açmamışsa giriş yapma sayfasına yönlendiriyor
      this.router.navigate(['login']);
      this.messageService.add({
        severity: 'info',
        summary: 'Giriş Yapmanız Gerekiyor!',
        detail: 'Lütfen Giriş Yaptıktan Sonra Tekrar Deneyiniz.',
      });

      return false;
    }
  }
}
