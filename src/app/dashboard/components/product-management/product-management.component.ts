import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Customer, Representative } from 'src/app/models/customer';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AddproductFormComponent } from './addproduct-form/addproduct-form.component';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent {
  customers!: Customer[];

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
    public  messageService: MessageService
  ) {}



  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }



  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  }

  show() {
    this.ref = this.dialogService.open(AddproductFormComponent, {
      header: 'Orion Innovation',
      width: '70%',
      contentStyle: { overflow: 'auto' },
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
