import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import { Product } from 'src/app/models/product';

import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-get-product',
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.scss'],
})
export class GetProductComponent {

  creoterId: any;

  products: Product[];

  isUserDialogOpen: boolean = false;



  constructor(
    private productService: ProductService,
    public dialogService: DialogService,
    public messageService: MessageService,
    private userService:UserService
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.creoterId = id;
        console.log(this.creoterId);
      })
    );
  }
  getAllProducts() {
    this.getUserId().subscribe(()=>{
      this.productService.getCreoterProducts(this.creoterId).subscribe((data: any) => {
        this.products = data;
        console.log(this.products);
      });
    })
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  deleteProduct(productId:any) {
    this.getUserId().subscribe((userId:any)=>{
      this.productService.deleteCreoterProduct(userId,productId).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Deleted Successfully',
        });
      });
    });
    this.getAllProducts();
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status) {
    switch (status) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      case ' ':
        return null;
    }
  }
}
