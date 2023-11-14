import { MessageService } from 'primeng/api';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(): Observable<boolean> {
    return this.userService.getUserByTokenId().pipe(
      map((role: string) => {
        if (role === 'ADMİN'){
          return true;
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'Bu kaynağa erişim izniniz yok.',
          });
          this.router.navigate(['/pages']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error in HasRoleGuard:', error);
        return of(false); // or handle the error and redirect accordingly
      })
    );
  }
}
