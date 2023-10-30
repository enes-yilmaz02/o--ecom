import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private collectionName = 'orders';
  private collectionNameFavorites = 'favorites';
  private userDocRef = this.afs.collection('users').doc();
  // Siparişler için bir Badge (bildirim sayacı)
  orderBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Favoriler için bir Badge
  favoritesBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private afs: AngularFirestore) {
    // Ürünler yüklendiğinde başlangıç değerlerini ayarlayın

    // Siparişlerin sayısını izle ve başlangıç değerini ayarla
    this.getItemsOrders().subscribe((items) => {
      this.orderBadge.next(items.length);
    });

    // Favorilerin sayısını izle ve başlangıç değerini ayarla
    this.getItemsFavorites().subscribe((items) => {
      this.favoritesBadge.next(items.length);
    });
  }

  // Sepete ürün ekler ve aynı zamanda Badge'i günceller
  addToCart(item: Product): Promise<any> {
    //const userDocRef = this.afs.collection('users').doc();
    return this.afs.collection(this.collectionName).add(item).then(() => {
      // Siparişler Badge'ini artır
      this.orderBadge.next(this.orderBadge.value + 1);
    });
  }

  // Favorilere ürün ekler ve aynı zamanda Badge'i günceller
  addToCartFavorites(item: Product): Promise<any> {
    // const userDocRef = this.afs.collection('users').doc();
    return this.afs.collection(this.collectionNameFavorites).add(item).then(() => {
      // Favoriler  Badge'ini artır
      this.favoritesBadge.next(this.favoritesBadge.value + 1);
    });
  }

  removeFromCartOrders(item: string): Promise<void> {
    return this.afs.collection(this.collectionName).doc(item).delete().then(() => {
      // Siparişler Badge'ini azalt
      this.orderBadge.next(this.orderBadge.value - 1);
    });
  }
  // Favorilerden ürünü kaldırır ve aynı zamanda Badge'i günceller
  removeFromCartFavorites(item: string): Promise<void> {
    return this.afs.collection(this.collectionNameFavorites).doc(item).delete().then(() => {
      // Favoriler Badge'ini azalt
      this.favoritesBadge.next(this.favoritesBadge.value - 1);
    }).catch((error) => {
      console.error("Favori ürünü silerken hata oluştu", error);
    });
}

  // Favori ürünleri izler ve bu konuda bir Observable döner
  getItemsFavorites(): Observable<Product[]> {
    return this.afs.collection(this.collectionNameFavorites).valueChanges();
  }

  // Sipariş ürünlerini izler ve bu konuda bir Observable döner
  getItemsOrders(): Observable<Product[]> {
    return this.afs.collection(this.collectionName).valueChanges();
  }
}
