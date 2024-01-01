import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BadgeService {

  private cartUpdatedSource = new Subject<void>();
  private orderUpdatedSource = new Subject<void>();
  private favoritesUpdatedSource = new Subject<void>();

  orderUpdated$ = this.orderUpdatedSource.asObservable();
  favoritesUpdated$ = this.favoritesUpdatedSource.asObservable();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

  updateCarts() {
    this.cartUpdatedSource.next();
  }

  updatedOrders() {
    this.orderUpdatedSource.next();
  }

  updateFavorites() {
    this.favoritesUpdatedSource.next();
  }


}
