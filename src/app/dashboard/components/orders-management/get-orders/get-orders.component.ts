import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import * as FileSaver from 'file-saver';
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

  orders:any;

  userId:any;

  userData:any;

  cols!: Column[];

  constructor(private productService:ProductService,private userService:UserService){
    this.getAllCreoterOrders();
    this.getUserData();
  }

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        const doc = new jsPDF.default('l', 'mm', 'a6');


        // Sütun başlıkları
        const columns: ExportColumn[] = [
          { title: 'Ad', dataKey: 'name' },
          { title:'File' , dataKey:'file'},
          { title: 'Aciklama', dataKey: 'description' },
          { title: 'Fiyat', dataKey: 'priceStacked' },
          { title: 'Adet', dataKey: 'quantity' },
          { title: 'Durum', dataKey: 'selectedStatus.name' }
        ];

        // Başlıkları ekleyin
        const header = columns.map((col) => col.title);
        const data = this.orders.map((order) => columns.map((col) => order.orders[0][col.dataKey]));

        (doc as any).autoTable({
          head: [header],
          body: data
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
      const flattenedOrders = this.orders.flatMap(order => {
        return order.orders.map(product => ({
          id: order.id,
          totalAmount: order.totalAmount,
          userId: order.userId,
          ...product  // Include all properties from the product
        }));
      });

      const worksheet = xlsx.utils.json_to_sheet(flattenedOrders);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'products');
    });
  }

saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
}


  getAllCreoterOrders(){
    this.productService.getAllProductOrders().subscribe((data:any)=>{
      this.orders=data;
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
        console.log(this.userId);
      })
    );
  }

  getUserData(){
    this.getUserId().subscribe(()=>{
      this.userService.getUser(this.userId).subscribe((data)=>{
        this.userData=data;
        console.log(this.userData)
      })
    })
  }
}
