import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { DataService } from 'src/app/services/data.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent  implements OnInit {
  productId: string;
  product: any;
  defaultValue = 0;
  productPrice: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService,
    private cartService:CartService,
    private data:DataService,
    private router:Router
  ) {
  }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      // Ürün detaylarını çekmek için bu fonksiyonu kullanın
      const data= this.data.getProductById(this.productId);
      if (data){
        console.log("ürün bulundu");
        this.product = data;
        this.productPrice = Number(this.product?.price);
        }else{
          console.log('ürüne erişilemedi');
        }
      })
    }



  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case 'IS':
        return 'success';
      case 'LS':
        return 'warning';
      case 'OS':
        return 'danger';
      default:
        return null;
    }
  }

  addToCart(product: Product) {
    const cartItem = {
      code: product.code,
      file: product.image,
      name: product.name,
      selectedStatus: product.inventoryStatus,
      quantity: this.defaultValue,
      category: product.category,
      priceStacked: product.price,
    };

    if (this.defaultValue >= 1) {
      this.cartService.addToCart(cartItem);
      this.messageService.add({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Ürün sepete eklendi',
      });
    } else if (this.defaultValue === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen',
        detail: 'Ürün miktarı giriniz',
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Başarısız',
        detail: 'Ürün sepete eklenemedi',
      });
    }

    this.defaultValue = 0;
  }

  updateProductPrice(): void {
    this.productPrice = this.defaultValue * this.product.priceStacked;
  }

  addToCartFavorites(item){
    this.cartService.addToCartFavorites(item);
  }
}
