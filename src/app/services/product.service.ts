import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productsEndpoint = 'products';

  uploadEndPoint= 'upload';

  constructor(private commonService:CommonService ) { }

// Ürün ekleme işlemi
addProduct(product:any) {
  return this.commonService.post(`${this.productsEndpoint}`,product)
}
uploadFile(file: File): Observable<any> {
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.commonService.post( `${this.productsEndpoint}/${this.uploadEndPoint}` ,formData);
}
// Ürün güncelleme işlemi
updateProduct(productId:any,body:any) {
  return this.commonService.put(`${this.productsEndpoint}/${productId}`,body)
}

// Ürün silme işlemi
deleteProduct(id: string) {
  return this.commonService.delete(`${this.productsEndpoint}/${id}`);
}

// Tüm ürünleri getirme
getProducts(): Observable<Product[]> {
  return this.commonService.get(this.productsEndpoint);

}

// Bir ürünü getirme
patchProductById(id:any) {
  return this.commonService.get(`${this.productsEndpoint}/${id}`)
}
}
