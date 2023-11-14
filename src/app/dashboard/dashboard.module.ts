import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './components/logs/logs.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoRootModule } from '../transloco-root.module';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AddproductFormComponent } from './components/product-management/addproduct-form/addproduct-form.component';
import { ProductService } from '../services/product.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GetProductComponent } from './components/product-management/get-product/get-product.component';
import { ProductSidebarComponent } from './components/product-management/product-sidebar/product-sidebar.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { UpdateProductComponent } from './components/product-management/update-product/update-product.component';
import { OrdersManagementComponent } from './components/orders-management/orders-management.component';
import { ProfilManagementComponent } from './components/profil-management/profil-management.component';
import { ReportingComponent } from './components/reporting/reporting.component';
@NgModule({
  declarations: [
       DashboardComponent,
       LogsComponent,
       ProductManagementComponent,
       AddproductFormComponent,
       GetProductComponent,
       ProductSidebarComponent,
       DashboardSidebarComponent,
       UpdateProductComponent,
       OrdersManagementComponent,
       ProfilManagementComponent,
       ReportingComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslocoRootModule,
    TranslocoModule,
    DashboardRoutingModule
  ],
  exports:[

  ],
  providers:[
    UserService,
    DialogService,
    TranslocoModule,
    ProductService
  ]
})
export class DashboardModule { }
