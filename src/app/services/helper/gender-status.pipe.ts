

import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'genderStatus',
  pure: false, // Bu önemlidir, böylece her dil değişikliğinde transform metodu tekrar çağrılır
})
export class GenderStatus implements PipeTransform, OnDestroy {
  private translocoSubscription: Subscription;

  constructor(private translocoService: TranslocoService) {
    // Dil değişikliği izleme
    this.translocoSubscription = this.translocoService.langChanges$.subscribe(() => {
      // Dil değiştiğinde tetikleme
    });
  }

  ngOnDestroy() {
    // Abonelikten çıkış yapma
    this.translocoSubscription.unsubscribe();
  }

  transform(gender: any): string[] {
    if (typeof gender === 'object' && gender !== null) {
      const translatedValue = this.translocoService.translate(`genderName.${gender}`);
      // Eğer translatedValue bir dizi değilse, onu bir dizi haline getir
      return Array.isArray(translatedValue) ? translatedValue : [translatedValue];
    }
    return [];
  }
}
