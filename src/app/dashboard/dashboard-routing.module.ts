import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { DashboardComponent } from './dashboard.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path:'' , component:DashboardComponent ,children:[
          {
            path:'user-management' , component:UserManagementComponent
          },
          {
            path:'product-management' , component:ProductManagementComponent
          }
        ]
      },

    ])
  ]
})
export class DashboardRoutingModule { }
