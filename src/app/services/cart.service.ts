import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MessageService } from 'primeng/api';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private collectionName ='orders';
  private collectionNameFavorites='favorites';
  constructor(private afs: AngularFirestore,private messageService:MessageService) {
  }
  addToCart(item: Product) :Promise<any>{
    return this.afs.collection(this.collectionName).doc().set({item}).then(()=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Başarılı!',
        detail:
          'Ürün sepete eklendiii',
      });
    }).catch((error) => {
    this.messageService.add({
      severity: 'warn',
      summary: 'Hata!',
      detail:
        'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin',
    });
  });
  }

  addToCartFavorites(item: Product) {
    return this.afs.collection(this.collectionNameFavorites).doc().set({item}).then(()=>{
      this.messageService.add({
        severity: 'success',
        summary: 'Başarılı!',
        detail:
          'Ürün sepete eklendiii',
      });
    }).catch((error) => {
    this.messageService.add({
      severity: 'warn',
      summary: 'Hata!',
      detail:
        'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin',
    });
  });
  }

  removeFromCart(item) {
    return this.afs.collection(this.collectionName).doc(item).delete();
  }

  removeFromCartFavorites(item: any) {
    return this.afs.collection(this.collectionNameFavorites).doc(item).delete();
  }

  getItemsFavorites() {
    return this.afs.collection(this.collectionNameFavorites).valueChanges();
  }

  getItems(){
    return this.afs.collection(this.collectionName).valueChanges();
  }
}
