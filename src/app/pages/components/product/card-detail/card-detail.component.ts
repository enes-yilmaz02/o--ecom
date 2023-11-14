import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';
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
  body:any;
  

  liked: boolean = false;

  images: string[] = [];

  selectedImageIndex: number = 0;

  quantity: number = 1;
        

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService,
    private cartService:CartService
  ) {


  }
  

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
       this.productService.patchProductById(this.productId).subscribe((data:any)=>{
        this.product = data;
        this.productPrice = Number(this.product?.priceStacked);
      });
      });
    }



  getSeverity(product: any) {
    switch (product?.selectedStatus) {
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

  addToCart(product: any) {
    debugger
    if (this.defaultValue >= 1) {
      this.cartService.addToCart(product).subscribe(()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Ürün sepete eklendi',
        });
      });
    } if (this.defaultValue === 0) {
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
    this.cartService.addToCartFavorites(item,this.body);
  }
}
