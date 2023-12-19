import { MessageService } from 'primeng/api';
import {
  CanActivate,
  Router,
} from '@angular/router';

import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { GoogleService } from '../auth/google.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private googleService:GoogleService
  ) {}

  canActivate(): Observable<boolean> {
    return forkJoin({
      role: this.userService.getUserByTokenId(),
      isAuthenticated: this.googleService.isAuthenticated(),
    }).pipe(
      switchMap((data) => {
        const { role, isAuthenticated } = data;
        console.log(isAuthenticated);
        if (role === 'USER' ||  isAuthenticated ) {
          return of(true);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Yetkisiz işlem',
            detail: 'Bu kaynağa erişim izniniz yok.',
          });
          this.router.navigate(['/']);
          return of(false);
        }
      }),
      catchError((error) => {
        console.error('Error in UserGuard:', error);
        return of(false);
      })
    );
  }
}
