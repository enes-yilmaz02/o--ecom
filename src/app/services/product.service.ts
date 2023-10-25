import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private collectionName = 'products';
  constructor(private firestore: AngularFirestore) { }

// Ürün ekleme işlemi
addProduct(product: Product): Promise<any> {
  return this.firestore.collection(this.collectionName).add(product);
}

// Ürün güncelleme işlemi
updateProduct(id: string, product: Product): Promise<void> {
  return this.firestore.collection(this.collectionName).doc(id).update(product);
}

// Ürün silme işlemi
deleteProduct(id: string): Promise<void> {
  return this.firestore.collection(this.collectionName).doc(id).delete();
}

// Tüm ürünleri getirme
getProducts(): Observable<Product[]> {
  return this.firestore.collection<Product>(this.collectionName).valueChanges();
}

// Belirli bir ürünü getirme
getProduct(id: string): Observable<Product> {
  return this.firestore.collection(this.collectionName).doc(id).valueChanges();
}

}
