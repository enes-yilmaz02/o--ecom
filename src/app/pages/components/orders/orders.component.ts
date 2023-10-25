import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
constructor(private cart:CartService){}
 items = this.cart.getItems();
removeFromCart(item){
  this.items = [];
  return this.items;
}

}
