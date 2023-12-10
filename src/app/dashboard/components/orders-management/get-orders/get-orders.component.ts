import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import * as FileSaver from 'file-saver';
import { error } from 'jquery';

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
  styleUrls: ['./get-orders.component.scss'],


})
export class GetOrdersComponent implements OnInit {
  orders: any;

  userId: any;

  userData: any;

  cols!: Column[];

  showDetails:boolean;

  userDetailStatus: { [userId: string]: boolean } = {};

  ordersLoading: boolean = true;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {

  }
  ngOnInit(): void {
    this.getAllCreoterOrders();
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('p', 'pt');

        // Sütun başlıkları
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
              // Tablonun stilleri
              fontSize: 12,
              font: 'helvetica', // veya başka bir font
              lineColor: [0, 0, 0], // Çizgi rengi (RGB)
              lineWidth: 0.5, // Çizgi kalınlığı
              fontStyle: 'normal', // 'normal', 'bold', 'italic', 'bolditalic'
              overflow: 'ellipsize', // 'linebreak', 'ellipsize', 'visible', 'hidden'
              textColor: [0, 0, 0], // Yazı rengi (RGB)
              cellPadding: 5, // Hücre içi boşluk
              fillColor: [255, 255, 255], // Hücre arka plan rengi (RGB)
            },
            columnStyles: {
              // Sütunların stilleri
              name: { fontStyle: 'bold', textColor: [0, 0, 255] }, // Ad sütunu için bold ve mavi renk
            },
            margin: { top: 60 }, // Tablo üstündeki boşluk
          });
        });

        // Blob oluşturun
        const blob = doc.output('blob');

        // Dosyayı indirin
        FileSaver.saveAs(blob, 'products.pdf');
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      // Flatten the data structure to include nested orders
      const flattenedOrders = this.orders.flatMap((order) => {
        return order.orders.map((product) => ({
          id: product.product.id,
          product:product.product.name, // Include all properties from the product
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
    this.getUserId().subscribe((userId) => {
      this.productService.getAllCreoterOrdersById(userId).subscribe((data: any) => {
        // Eğer herhangi bir sipariş bulunamazsa, this.orders'u boş bir diziyle güncelle
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
        // Siparişler alındıktan sonra her bir userId için alıcı bilgilerini getir
        this.orders.forEach((order: any) => {
          this.getUserData(order.userId);
        });
        this.ordersLoading = false;

      },
      (error)=>{
        console.error('Error fetching orders:', error);
        this.ordersLoading = true;
      }
      );
    });
  }

  getFileUrl(fileName: string): string {
    // Update the URL template based on your file structure in Google Cloud Storage
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
      // Siparişi bul
      const order = this.orders.find((order) => order.userId === userId);

      // Eğer sipariş bulunamazsa veya userData daha önce eklenmişse çık
      if (!order || order.userData) {
        return;
      }

      // Alıcı bilgilerini siparişe ekle
      order.userData = data;

      // Eğer userDataArray dizisi henüz tanımlanmamışsa, tanımlayın
      if (!order.userDataArray) {
        order.userDataArray = [];
      }

      // Alıcı bilgilerini userDataArray dizisine ekleyin
      order.userDataArray.push(data);

    });
  }

  toggleUserDetails(userId: string): void {
    // Eğer userId tanımlı değilse, varsayılan değeri true olarak ata
    this.userDetailStatus[userId] = !this.userDetailStatus[userId];
  }

}
