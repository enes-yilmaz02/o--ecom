import { MessageService } from 'primeng/api';
import {
  CanActivate,
  Router,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(): boolean {
    // Kullanıcının oturum açıp açmadığını ve tokenın var olup olmadığını kontrol ediyor
    if (this.authService.isAuth() || this.authService.getAuthToken()) {
      return true; // Eğer kullanıcı oturum açıksa ve token varsa, işlemi devam ettir
    } else {
      // Token süresi bitmişse veya hiç token yoksa
      // Otomatik olarak login sayfasına yönlendiriyor

      // Bu kısım token süresi bitmiş ise çalışacak
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
