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
@NgModule({
  declarations: [
       DashboardComponent,
       LogsComponent,
       UserManagementComponent,
       AdduserFormComponent,
       UpdateuserFormComponent,
       ProductManagementComponent,
       AddproductFormComponent

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
