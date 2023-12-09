import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { CategoryStatus } from 'src/app/services/helper/category-status.pipe';
@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.scss'],
  providers:[StockStatusPipe,CategoryStatus]
})
export class ContentTableComponent {

  totalPrice: number; // Sipariş toplam fiyatını saklamak için değişken

  products: any; // Sipariş ürünlerini saklamak için değişken

  orders: any;

  ordersItem:any;

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any; // Sipariş ID'sini saklamak için değişken

  // Constructor, servis bağımlılıklarını enjekte eder
  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {

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
      this.orders = data.map((item: any) => ({
        orderDate: item.orderDate,
        id: item.id,  // Burada siparişin id'sini ekleyin
        orders: item.orders.map((orderItem: any) => ({
          ...orderItem,
          product: orderItem.product,  // Burada ürünü düzeltin
        })),
        totalAmount: item.totalAmount,
        userId: item.userId,
      }));
      console.log(this.orders)
      if (this.orders) {
        this.products = this.orders
          .map((order: any) => order.orders.map((item: any) => item.product))
          .flat();
      } else {
        console.error('Orders data is undefined.');
      }
    });
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
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

  getSeverity(product: any) {
    switch (product.selectedStatus.name) {
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
