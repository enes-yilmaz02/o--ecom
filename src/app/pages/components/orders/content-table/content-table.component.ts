import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { CategoryStatus } from 'src/app/services/helper/category-status.pipe';
@Component({
  selector: 'app-content-table',
  templateUrl: './content-table.component.html',
  styleUrls: ['./content-table.component.scss'],
  providers: [StockStatusPipe, CategoryStatus],
})
export class ContentTableComponent {
  totalPrice: number;
  products: any;
  orders: any;
  ordersItem: any;
  dataAvailable: boolean = false;
  userId: any;


  constructor(
    private userService: UserService,
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

  getOrders() {
    return this.userService.getOrders(this.userId).subscribe((data: any) => {
      this.orders = data.map((item: any) => ({
        orderDate: item.orderDate,
        id: item.id,
        orders: item.orders.map((orderItem: any) => ({
          ...orderItem,
          product: orderItem.product,
        })),
        totalAmount: item.totalAmount,
        userId: item.userId,
      }));
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
