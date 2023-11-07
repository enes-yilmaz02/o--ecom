import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import {  Representative } from 'src/app/models/customer';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AddproductFormComponent } from './addproduct-form/addproduct-form.component';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent {
  customers!: any[];

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  products: Product[];

  isUserDialogOpen: boolean = false;

  ref: DynamicDialogRef | undefined;


  constructor(
    private productService: ProductService,
    public  dialogService: DialogService,
    public  messageService: MessageService,
    private commonService:CommonService
  ) {

    console.log(this.commonService.get('products'));

  }



  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
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

  show() {
    this.ref = this.dialogService.open(AddproductFormComponent, {
      header: 'Orion Innovation',
      width: '50%',
      height:'600px',
      contentStyle: { overflow: 'auto'},
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
