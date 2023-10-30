import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  totalPrice: number;
  items: Product[];

  constructor(private cart: CartService) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getOrders();
    console.log(this.getOrders());
  }

  getOrders() {
    this.cart.getItemsOrders().subscribe((data: Product[]) => {
      this.items = data;
      this.calculateTotalPrice();
    });
  }

  calculateTotalPrice() {
    this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
  }

  removeFromCartOrders(item: any) {
    // Sepetten ürünü kaldırma işlemi
    this.cart
      .removeFromCartOrders(item)
      .then(() => {
        // Ürünü kaldırdıktan sonra items dizisini güncelleyin
        this.getOrders();
      })
      .catch((error) => {
        console.error('Ürün kaldırılırken hata oluştu', error);
      });
  }
}
