import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
})
export class CartsComponent {
  totalPrice: number;

  product: any;

  quantityOptions: SelectItem[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ];

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any ; //Tokenden gelen user için tanımlı değişken

  constructor(
    private messageService: MessageService,
    private userService:UserService
  ) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getUserId().subscribe(() => {
      this.getCarts();
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
        console.log(this.userId);
      })
    );
  }

  getCarts() {
    return this.userService.getCarts(this.userId).subscribe((data:any)=>{
      this.product = data ;
      this.calculateTotalPrice();
    })
  }

  calculateTotalPrice() {
    this.totalPrice = this.product.reduce(
      (total, item) => total + item.priceStacked,
      0
    );
  }

  deleteCarts(cartId: any) {
    this.getUserId().subscribe(() => {
      this.userService.deleteCart(this.userId, cartId).subscribe(
        async () => {
          await this.messageService.add({ severity: 'success', summary: 'Ürün sepetten kaldırıldı' });
          console.log(this.userId, cartId);
          this.getCarts();
        },
        (error) => {
          // Hata durumunda mesaj göster
          this.messageService.add({
            severity: 'error',
            summary: 'Sipariş silinemedi!',
            detail: error.error.detail || 'Bilinmeyen bir hata oluştu.',
          });
          // Hatanın nedenini konsola yazdır
          console.error('Sipariş silinemedi!', error);
        }
      );
    });
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
