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
  private favoritesAddedSubject = new Subject<string>();
  private favoritesRemovedSubject = new Subject<string>();

  favoritesAdded$ = this.favoritesAddedSubject.asObservable();
  favoritesRemoved$ = this.favoritesRemovedSubject.asObservable();
  cartUpdated$ = this.cartUpdatedSource.asObservable();
  orderBadge$ = this.orderBadgeSubject.asObservable();
  favoritesBadge$ = this.favoritesBadgeSubject.asObservable();
  cartsBadge$ = this.cartsBadgeSubject.asObservable();

  emitFavoritesAddedEvent(productId: string) {
    this.favoritesAddedSubject.next(productId);
  }

  emitFavoritesRemovedEvent(productId: string) {
    this.favoritesRemovedSubject.next(productId);
  }

  emitCartUpdatedEvent() {
    this.cartUpdatedSource.next();
  }

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
