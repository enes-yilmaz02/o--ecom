import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  private orderBadgeSubject = new BehaviorSubject<number>(0);
  private favoritesBadgeSubject = new BehaviorSubject<number>(0);
  private cartsBadgeSubject = new BehaviorSubject<number>(0);
  private cartUpdatedSource = new Subject<void>();
  private favoritesUpdatedSource = new Subject<void>();
  private orderUpdatedSource = new Subject<void>();

  orderBadge$ = this.orderBadgeSubject.asObservable();
  orderUpdated$ = this.orderUpdatedSource.asObservable();
  favoritesBadge$ = this.favoritesBadgeSubject.asObservable();
  favoritesUpdated$ = this.favoritesUpdatedSource.asObservable();
  cartsBadge$ = this.cartsBadgeSubject.asObservable();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  emitCartUpdatedEvent() {
    this.cartUpdatedSource.next();
  }

  emitOrderUpdatedEvent() {
    this.orderUpdatedSource.next();
  }

  emitFavoritesUpdatedEvent() {
    this.favoritesUpdatedSource.next();
  }

  updateOrderBadge(count: number) {
    this.orderBadgeSubject.next(count);
  }

  updateFavoritesBadge(count:number) {
    this.favoritesBadgeSubject.next(count);
  }

  updateCartsBadge(count: number) {
    this.cartsBadgeSubject.next(count);
  }
}
