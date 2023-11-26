import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  private orderBadgeSubject = new BehaviorSubject<number>(0);
  private favoritesBadgeSubject = new BehaviorSubject<number>(0);
  private cartsBadgeSubject = new BehaviorSubject<number>(0);

  orderBadge$ = this.orderBadgeSubject.asObservable();
  favoritesBadge$ = this.favoritesBadgeSubject.asObservable();
  cartsBadge$ = this.cartsBadgeSubject.asObservable();

  updateOrderBadge(count: number) {
    this.orderBadgeSubject.next(count);
  }

  updateFavoritesBadge(count: number) {
    this.favoritesBadgeSubject.next(count);
  }

  updateCartsBadge(count: number) {
    this.cartsBadgeSubject.next(count);
  }
}
