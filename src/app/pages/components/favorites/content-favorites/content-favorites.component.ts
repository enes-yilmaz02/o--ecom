import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-content-favorites',
  templateUrl: './content-favorites.component.html',
  styleUrls: ['./content-favorites.component.scss']
})
export class ContentFavoritesComponent {
  product: any;



  constructor(private cartService: CartService , private messageService:MessageService) {
    this.getFavorites();
  }

  getFavorites() {
    return this.cartService.getItemsFavorites().subscribe((data:any)=>{
      this.product=data;
    });
  }

  removeFromCartFavorites(id :any) {
    this.cartService.removeFromCartFavorites(id).subscribe(()=>{
     this.messageService.add({
          severity:'success', summary: 'Başarılı', detail: 'ürün favorilerden kaldırıldı'
        });
    });
    this.getFavorites();
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
