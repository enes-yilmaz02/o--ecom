import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss']
})
export class CartsComponent {
  totalPrice: number;

  product: any;

  quantityOptions: SelectItem[] = [{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }];


  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  constructor(private cartService: CartService , private messageService:MessageService) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getOrders();


  }

  getOrders() {
    return this.cartService.getItemsOrders().subscribe((data:any)=>{
      this.product=data;
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.product.reduce((total, item) => total + item.priceStacked, 0);
  }

  removeFromCartOrders(id:any) {
     this.cartService.removeFromCartOrders(id).subscribe(()=>{
      this.messageService.add({
           severity:'success', summary: 'Başarılı', detail: 'ürün Siparişlerden kaldırıldı'
         });
     });
     this.getOrders();
  }

  getSeverity(product: any) {
    switch (product?.selectedStatus) {
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
}
