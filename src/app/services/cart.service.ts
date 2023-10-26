import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addToCart(item: any) {
    const currentItems = this.cartItems.getValue();
    currentItems.push(item);
    this.cartItems.next(currentItems);
  }

  removeFromCart(item: any) {
    const currentItems = this.cartItems.getValue();
    const updatedItems = currentItems.filter(cartItem => cartItem !== item);
    this.cartItems.next(updatedItems);
  }

  getItems() {
    return this.cartItems.getValue();
  }
}
