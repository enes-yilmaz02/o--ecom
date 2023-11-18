import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { DashboardComponent } from './dashboard.component';
import { AddproductFormComponent } from './components/product-management/addproduct-form/addproduct-form.component';
import { GetProductComponent } from './components/product-management/get-product/get-product.component';
import { UpdateProductComponent } from './components/product-management/update-product/update-product.component';
import { OrdersManagementComponent } from './components/orders-management/orders-management.component';
import { ProfilManagementComponent } from './components/profil-management/profil-management.component';
import { ReportingComponent } from './components/reporting/reporting.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: DashboardComponent, children: [
          {
            path: '', component: ProductManagementComponent , children:[
              {
                path:'', component:GetProductComponent
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
                path:'update-product/:id' , component:UpdateProductComponent
              }
            ]
          },
          {
            path: 'order-management', component: OrdersManagementComponent
          },
          {
            path: 'profil-management', component: ProfilManagementComponent
          },
          {
            path: 'reporting', component: ReportingComponent
          },
          {
            path:'pages' , loadChildren: () =>import('../pages/pages.module').then((m) => m.PagesModule),
          }
        ]
      },
    ])
  ]
})
export class DashboardRoutingModule { }
