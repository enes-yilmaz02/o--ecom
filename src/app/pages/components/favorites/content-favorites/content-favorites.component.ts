import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-content-favorites',
  templateUrl: './content-favorites.component.html',
  styleUrls: ['./content-favorites.component.scss']
})
export class ContentFavoritesComponent {
  product: any;



  constructor(private cartService: CartService) {
    this.getFavorites();
  }

  getFavorites() {
    return this.cartService.getItemsFavorites().subscribe((data:any)=>{
      this.product=data;
    });
  }

  removeFromCartFavorites(id :any) {
      return this.cartService.removeFromCartFavorites(id);
  }
}
