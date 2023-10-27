import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  items = this.cart.getItems();

  constructor(private cart:CartService , private messageService:MessageService){}

removeFromCart(item) {
  // Sepetten ürünü kaldırma işlemi
  // Örnek: CartService kullanarak sepetten ürünü kaldırmak
  this.cart.removeFromCart(item);
  this.messageService.add({
    severity: 'success',
    summary: 'Başarılı',
    detail: 'Seçilen ürün favorilerimden kaldırıldı',
  });
  // Ürünü kaldırdıktan sonra items dizisini güncelleyin
  this.items = this.cart.getItems();

}

}
