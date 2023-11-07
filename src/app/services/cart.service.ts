import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private collectionNameOrders = 'orders';

  getFavoritesEndPoint = 'favorites' ;

  getOrdersEndPoint = 'orders' ;


  // private userDocRef = this.afs.collection('users').doc();
  // Siparişler için bir Badge (bildirim sayacı)
  orderBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  // Favoriler için bir Badge
  favoritesBadge: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private commonService: CommonService) {
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
  addToCart(item: any , body:any ){
    //const userDocRef = this.afs.collection('users').doc();
    return this.commonService.put(item , body);

    // .then(() => {
    //   // Siparişler Badge'ini artır
    //   this.orderBadge.next(this.orderBadge.value + 1);
    // });
  }

  // Favorilere ürün ekler ve aynı zamanda Badge'i günceller
  addToCartFavorites(item: any , body:any){
    // const userDocRef = this.afs.collection('users').doc();
    return this.commonService.put(item , body)

    // then(() => {
    //   // Favoriler  Badge'ini artır
    //   this.favoritesBadge.next(this.favoritesBadge.value + 1);
    // });
  }

  removeFromCartOrders(id: any){
    return this.commonService.delete(id )
    // .then(() => {
    //   // Siparişler Badge'ini azalt
    //   this.orderBadge.next(this.orderBadge.value - 1);
    // });
  }
  // Favorilerden ürünü kaldırır ve aynı zamanda Badge'i günceller
  removeFromCartFavorites(id: any) {
    return this.commonService.delete(id)
    // .then(() => {
    //   // Favoriler Badge'ini azalt
    //   this.favoritesBadge.next(this.favoritesBadge.value - 1);
    // })
}

  // Favori ürünleri izler ve bu konuda bir Observable döner
  getItemsFavorites() : Observable<Product[]>{
    return this.commonService.get(this.getFavoritesEndPoint);
  }

  // Sipariş ürünlerini izler ve bu konuda bir Observable döner
  getItemsOrders(): Observable<Product[]> {
    return this.commonService.get(this.getOrdersEndPoint);
  }
}
