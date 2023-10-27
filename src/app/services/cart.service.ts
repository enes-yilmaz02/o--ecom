import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  private cartItemsFavorites = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();
  cartItemsFavorites$= this.cartItemsFavorites.asObservable();

  constructor() { }

  addToCart(item: any) {
    const currentItems = this.cartItems.getValue();
    currentItems.push(item);
    this.cartItems.next(currentItems);
  }

  addToCartFavorites(item: any) {
    const currentItems = this.cartItemsFavorites.getValue();
    currentItems.push(item);
    this.cartItemsFavorites.next(currentItems);
  }

  removeFromCart(item: any) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(cartItem => cartItem !== item);
    this.cartItems.next(updatedItems);
  }

  removeFromCartFavorites(item: any) {
    const currentItems = this.cartItemsFavorites.getValue();
    const updatedItems = currentItems.filter(cartItemsFavorites => cartItemsFavorites !== item);
    this.cartItemsFavorites.next(updatedItems);
  }
  getItemsFavorites() {
    return this.cartItemsFavorites.getValue();
  }

  getItems() {
    return this.cartItems.getValue();
  }
}
