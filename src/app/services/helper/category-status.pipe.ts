

import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'categoryStatus',
  pure: false, // Bu önemlidir, böylece her dil değişikliğinde transform metodu tekrar çağrılır
})
export class CategoryStatus implements PipeTransform, OnDestroy {
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

  transform(category: any) {
    return this.translocoService.translate(`categoryName.${category}`);
  }
}
