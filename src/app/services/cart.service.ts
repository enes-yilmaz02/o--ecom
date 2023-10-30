import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private collectionName = 'orders';
  private collectionNameFavorites = 'favorites';

  constructor(private afs: AngularFirestore) {
  }

  addToCart(item: Product): Promise<any> {
    const userDocRef = this.afs.collection('users').doc();
    return userDocRef.collection('orders').add(item);
  }

  addToCartFavorites(item: Product): Promise<any> {
    const userDocRef = this.afs.collection('users').doc();
    return userDocRef.collection('favorites').add(item);
  }

  removeFromCart(item: string): Promise<void> {
    return this.afs.collection(this.collectionName).doc(item).delete();
  }

  removeFromCartFavorites(item: string): Promise<void> {
    return this.afs.collection(this.collectionNameFavorites).doc(item).delete();
  }

  getItemsFavorites(): Observable<Product[]> {
    return this.afs.collection<Product>(this.collectionNameFavorites).valueChanges();
  }

  getItems(): Observable<Product[]> {
    return this.afs
      .collection<Product>(this.collectionName)
      .valueChanges();
  }

}
