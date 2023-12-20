import { TokenGuard } from './token.guard';
import { MessageService } from 'primeng/api';
import {
  ActivatedRoute,
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
    private googleService:GoogleService,
    private tokenGuard:TokenGuard,
    private route:ActivatedRoute
  ) {}

  canActivate(): Observable<boolean> {
    return forkJoin({
      role: this.userService.getUserByTokenId(),
    }).pipe(
      switchMap((data) => {
        const { role } = data;

        if (role === 'USER') {
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
