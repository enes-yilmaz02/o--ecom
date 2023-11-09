import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { DashboardComponent } from './dashboard.component';
import { AddproductFormComponent } from './components/product-management/addproduct-form/addproduct-form.component';
import { GetProductComponent } from './components/product-management/get-product/get-product.component';
import { GetUserComponent } from './components/user-management/get-user/get-user.component';
import { AdduserFormComponent } from './components/user-management/adduser-form/adduser-form.component';
import { UpdateProductComponent } from './components/product-management/update-product/update-product.component';
import { UpdateuserFormComponent } from './components/user-management/updateuser-form/updateuser-form.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: DashboardComponent, children: [
          {
            path: '', component: ProductManagementComponent
          },
          {
            path: 'user-management', component: UserManagementComponent, children:[
              {
                path: '', component: GetUserComponent
              },
              {
                path: 'add-user', component: AdduserFormComponent
              },
              {
                path:'get-user' , component:GetUserComponent
              },
              {
                path:'update-user/:id' , component:UpdateuserFormComponent
              }
            ]
          },
          {
            path: 'product-management', component: ProductManagementComponent, children: [
              {
                path: '', component: GetProductComponent
              },
              {
                path: 'add-product', component: AddproductFormComponent
              },
              {
                path:'get-product' , component:GetProductComponent
              },
              {
                path:'update-product' , component:UpdateProductComponent
              }
            ]
          }
        ]
      },
    ])
  ]
})
export class DashboardRoutingModule { }
