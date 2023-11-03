import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent implements OnInit{
  productId: string;
  item: any;
  defaultValue = 0;
  productPrice: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService,
    private cartService:CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.productService.getProductById(this.productId).subscribe((data: Product) => {
        this.item = data;
        console.log(data)
      });
    });
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
      priceStacked: this.productPrice,
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
    this.productPrice = this.defaultValue * this.item.priceStacked;
  }

  addToCartFavorites(item){
    this.cartService.addToCartFavorites(item);
  }
}
