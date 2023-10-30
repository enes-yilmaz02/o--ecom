import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  items: Product[];

  constructor(private cart: CartService , private messageService:MessageService) {
    this.getFavorites();
  }

  getFavorites() {
    this.cart.getItemsFavorites().subscribe((data: Product[]) => {
      this.items = data;
      console.log(data);
    });

  }

  removeFromCartFavorites(item : string) {
    this.cart.removeFromCartFavorites(item).then(() => {
      // Favorilerden ürünü kaldırdıktan sonra favorileri yeniden al
      this.getFavorites();
    }).catch((error) => {
      this.messageService.add({
        severity: 'error',
          summary: 'Hata!',
          detail: 'Ürün favorilerime kaldırılamadı',
      })
    });
  }
}
