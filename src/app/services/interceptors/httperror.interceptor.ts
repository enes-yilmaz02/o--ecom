import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class HttperrorInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404 && error.error?.message === 'Belirtilen ürün favori olarak bulunamadı.') {
          // Favori bulunamadığında özel işlemleri burada gerçekleştirin
          // this.messageService.add({
          //   severity: 'warn',
          //   summary: 'Hata',
          //   detail: 'Belirtilen ürün favori olarak bulunamadı.',
          // });
        }

        return throwError(error);
      })
    );
  }
}
