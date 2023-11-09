import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  productsEndpoint = 'products';

  productEndpoint = 'product';


  constructor(private commonService:CommonService ) { }

// Ürün ekleme işlemi
addProduct(product:any ) {
  debugger
  return this.commonService.post(this.productEndpoint , product )
}

// Ürün güncelleme işlemi
updateProduct(id: string, product: string) {
  return this.commonService.post(id , product)
}

// Ürün silme işlemi
deleteProduct(id: string) {
  return this.commonService.delete(this.productsEndpoint+`/${id}`);
}

// Tüm ürünleri getirme
getProducts(): Observable<Product[]> {
  return this.commonService.get(this.productsEndpoint);

}

patchProductById(id:any) {
  return this.commonService.get(`${this.productEndpoint}/${id}`)
}

}
