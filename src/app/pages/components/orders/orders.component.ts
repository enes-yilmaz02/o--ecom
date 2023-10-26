import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  totalPrice:number;
constructor(private cart:CartService , private router:Router){}
  ngOnInit(): void {
    this.totalPrice=this.calculateTotalPrice().valueOf();
  }
 items = this.cart.getItems();

 calculateTotalPrice() {
  this.totalPrice = this.items.reduce((total,item) => total + item.price, 0);
  return this.totalPrice;
}


removeFromCart(item) {
  // Sepetten ürünü kaldırma işlemi
  // Örnek: CartService kullanarak sepetten ürünü kaldırmak
  this.cart.removeFromCart(item);

  // Ürünü kaldırdıktan sonra items dizisini güncelleyin
  this.items = this.cart.getItems();
  this.calculateTotalPrice();
}

}
