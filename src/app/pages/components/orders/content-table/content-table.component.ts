import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.scss']
})
export class ContentTableComponent {
  totalPrice: number;

  product: any;

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  constructor(private cartService: CartService) {
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

  removeFromCartOrders(id: any) {
    return this.cartService.removeFromCartOrders(id);
  }
}
