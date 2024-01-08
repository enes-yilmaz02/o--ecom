import { Component } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}
@Component({
  selector: 'app-get-orders',
  templateUrl: './get-orders.component.html',
  styleUrls: ['./get-orders.component.scss']
})
export class GetOrdersComponent {
  orders: any;
  userId: any;
  userData: any;
  cols!: Column[];
  showDetails:boolean;
  userDetailStatus: { [userId: string]: boolean } = {};
  ordersLoading: boolean;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {

  }
  ngOnInit(): void {
    this.ordersLoading=false;
    this.getAllCreoterOrders();
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'pt');
        const columns: ExportColumn[] = [
          { title: 'Ürün Adi', dataKey: 'name' },
          { title: 'Fiyat($)', dataKey: 'priceStacked' },
          { title: 'Ürün Adedi', dataKey: 'quantity' },

        ];


        const header = columns.map((col) => col.title);

        this.orders.forEach((order) => {
          (doc as any).autoTable({
            head: [header],
            body: order.userDataArray.flatMap(() =>
                order.orders.map((orderItem: any) => [
                orderItem.product.name,
                orderItem.product.priceStacked,
                orderItem.product.quantity,
              ])
            ),
            styles: {
              fontSize: 12,
              font: 'helvetica',
              lineColor: [0, 0, 0],
              lineWidth: 0.5,
              fontStyle: 'normal',
              overflow: 'ellipsize',
              textColor: [0, 0, 0],
              cellPadding: 5,
              fillColor: [255, 255, 255],
            },
            columnStyles: {
              name: { fontStyle: 'bold', textColor: [0, 0, 255] },
            },
            margin: { top: 60 },
          });
        });
        const blob = doc.output('blob');
        FileSaver.saveAs(blob, 'products.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const flattenedOrders = this.orders.flatMap((order) => {
        return order.orders.map((product) => ({
          id: product.product.id,
          product:product.product.name,
          userId: order.userId,
          totalAmount: order.totalAmount,
        }));
      });

      const worksheet = xlsx.utils.json_to_sheet(flattenedOrders);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  getAllCreoterOrders() {
    this.productService.getAllCreoterOrders().subscribe(
      (data: any) => {
        this.orders = data ? data.map((item: any) => ({
          orderDate: item.orderDate,
          id: item.id,
          orders: item.orders.map((orderItem: any) => ({
            ...orderItem,
            product: orderItem.product,
          })),
          totalAmount: item.totalAmount,
          userId: item.userId,
        })) : [];

        this.orders.forEach((order: any) => {
          this.getUserData(order.userId);
        });

        this.ordersLoading = false;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.ordersLoading = true;
      }
    );
  }
  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;

      })
    );
  }

  getUserData(userId: string) {
    this.userService.getUser(userId).subscribe((data) => {
      const order = this.orders.find((order) => order.userId === userId);
      if (!order || order.userData) {
        return;
      }
      order.userData = data;
      if (!order.userDataArray) {
        order.userDataArray = [];
      }
      order.userDataArray.push(data);

    });
  }

  toggleUserDetails(userId: string): void {
    this.userDetailStatus[userId] = !this.userDetailStatus[userId];
  }
}
