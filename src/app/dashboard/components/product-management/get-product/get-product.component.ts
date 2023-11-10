import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AddproductFormComponent } from '../addproduct-form/addproduct-form.component';
@Component({
  selector: 'app-get-product',
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.scss'],
})
export class GetProductComponent {
  products: Product[];

  isUserDialogOpen: boolean = false;



  constructor(
    private productService: ProductService,
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }
  // getCategoryName(product: any): string {
  //   return product.category ? product.category.name : '';
  // }

  // getSelectedStatusName(product: any): string {
  //   return product.selectedStatus ? product.selectedStatus.name : '';
  // }
  deleteProduct(id: any) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Deleted Successfully',
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
