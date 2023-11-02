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

  items: Product[];

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  constructor(private cart: CartService, private messageService:MessageService) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getOrders();

  }

  getOrders() {
    this.cart.getItemsOrders().subscribe((data: Product[]) => {
      this.items = data;
      this.calculateTotalPrice();
      this.dataAvailable = true; // Veriler başarıyla alındı
    },
    (error) => {
      this.messageService.add({
        severity:'error',
        summary:'Hata!',
        detail:'Veriler alınamadı'
      })
      this.dataAvailable = false; // Veriler alınamadı
    }
    );
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
