import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { Users } from 'src/app/models/users';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent {
  productId: string;
  product: any;
  defaultValue = 0; // Seçilen ürün sayısını tutacak değişken
  productPrice: number; // Güncellenmiş ürün fiyatını tutacak değişken
  user:Users;
  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private messageService: MessageService,
    private productService:ProductService
  ) {}

  ngOnInit() {
    console.log(this.defaultValue);
    // ActivatedRoute'i kullanarak ürün kimliğini al
    this.route.params.subscribe((params) => {
      this.productId = params['id']; // Bu, "id" parametresine karşılık gelir
      this.product = this.productService.getProduct(this.productId);
    });
  }
  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }

  addToCart(product: Product ) {
    const cartItem = {
      id: product.id,
      image: product.image,
      name: product.name,
      status: product.inventoryStatus,
      quantity: this.defaultValue,
      category: product.category,
      price: this.productPrice,
    };
    if(this.defaultValue>=1){
      this.cart.addToCart(cartItem);
      this.messageService.add({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Ürün sepete eklendi',
      });
    }
    else if(this.defaultValue===0){
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen',
        detail: 'Ürün miktarı giriniz',
      });
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Başarısız',
        detail: 'Ürün sepete eklenemedi',
      });
    }
    // Ekleme işlemi tamamlandığında seçilen ürün sayısını sıfırlayabilirsiniz.
    this.defaultValue = 0;
  }

  updateProductPrice(): void {
    this.productPrice = this.defaultValue * this.product.price;
  }

  addToCartFavorites(product: Product) {
    const cartItemsFavorites = {
      id: product.id,
      image: product.image,
      name: product.name,
      status: product.inventoryStatus,
      category: product.category,
      price: product.price,
    };

      if(this.cart.addToCartFavorites(cartItemsFavorites)){
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Ürün favorilerime eklendi',
        });
      }else{
        this.messageService.add({
          severity: 'error',
          summary: 'Hata!',
          detail: 'Ürün favorilerime eklenemedi',
        });
      }

  }
}
