import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent  {
  totalPrice:number;
  items$: Product[] = [];
constructor(private cart:CartService , private messageService:MessageService){
  this.cart.getItems().subscribe((data: Product[]) => {
    this.items$ = data;
  });
}



 calculateTotalPrice() {
  this.totalPrice = this.items$.reduce((total, item) => total + item.price, 0);
  return this.totalPrice;

}
removeFromCart(item) {
    // Sepetten ürünü kaldırma işlemi
  // Örnek: CartService kullanarak sepetten ürünü kaldırmak
  this.cart.removeFromCart(item);
  // Ürünü kaldırdıktan sonra items dizisini güncelleyin
  this.cart.getItems();
  this.calculateTotalPrice();

  this.messageService.add({
    severity: 'success',
    summary: 'Başarılı',
    detail: 'Seçilen ürün silindi',
  });
}

}
