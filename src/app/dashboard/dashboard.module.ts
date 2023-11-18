import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './components/logs/logs.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { UserService } from '../services/user.service';
import { AdduserFormComponent } from './components/user-management/adduser-form/adduser-form.component';
import { DialogService } from 'primeng/dynamicdialog';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoRootModule } from '../transloco-root.module';
import { UpdateuserFormComponent } from './components/user-management/updateuser-form/updateuser-form.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AddproductFormComponent } from './components/product-management/addproduct-form/addproduct-form.component';
import { ProductService } from '../services/product.service';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GetProductComponent } from './components/product-management/get-product/get-product.component';
import { ProductSidebarComponent } from './components/product-management/product-sidebar/product-sidebar.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { UpdateProductComponent } from './components/product-management/update-product/update-product.component';
import { GetUserComponent } from './components/user-management/get-user/get-user.component';
import { UserSidebarComponent } from './components/user-management/user-sidebar/user-sidebar.component';
import { OrdersManagementComponent } from './components/orders-management/orders-management.component';
import { ProfilManagementComponent } from './components/profil-management/profil-management.component';
import { ReportingComponent } from './components/reporting/reporting.component';
import { GetOrdersComponent } from './components/orders-management/get-orders/get-orders.component';
@NgModule({
  declarations: [
       DashboardComponent,
       LogsComponent,
       UserManagementComponent,
       AdduserFormComponent,
       UpdateuserFormComponent,
       ProductManagementComponent,
       AddproductFormComponent,
       GetProductComponent,
       ProductSidebarComponent,
       DashboardSidebarComponent,
       UpdateProductComponent,
       GetUserComponent,
       UserSidebarComponent,
       OrdersManagementComponent,
       ProfilManagementComponent,
       ReportingComponent,
       GetOrdersComponent

  ],
  imports: [
    CommonModule,
    SharedModule,
    TranslocoRootModule,
    TranslocoModule,
    DashboardRoutingModule
  ],
  exports:[
    AdduserFormComponent,
    UserManagementComponent,

  ],
  providers:[
    UserService,
    DialogService,
    TranslocoModule,
    ProductService
  ]
})
export class DashboardModule { }
