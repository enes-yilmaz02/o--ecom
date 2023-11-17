import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.scss'],
})
export class ContentTableComponent {

  totalPrice: number; // Sipariş toplam fiyatını saklamak için değişken

  products: any; // Sipariş ürünlerini saklamak için değişken

  orders: any;

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any; // Sipariş ID'sini saklamak için değişken

  // Constructor, servis bağımlılıklarını enjekte eder
  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {

    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getUserId().subscribe(() => {
      this.getOrders();
    });

  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  // Kullanıcının siparişlerini getiren fonksiyon
  getOrders() {
    return this.userService.getOrders(this.userId).subscribe((data: any) => {
      this.products = data;
      console.log(this.products);

    });
  }

  deleteOrders(orderId:any){
   this.getUserId().subscribe(()=>{
    this.userService.deleteOrder(this.userId , orderId).subscribe(()=>{
      this.messageService.add({
        severity:'success', summary: 'Sipariş silindi!'
      });
    },
    (error) => {
      this.messageService.add({
        severity:'error', summary: 'Sipariş silinemedi!', detail: error.error.detail
      });
    });
   })
    this.getOrders();
    console.log(this.userId + "-" +orderId);
  }

  // Ürün durumuna göre uygun olan "severity"yi döndüren fonksiyon
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
