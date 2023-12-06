import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { UsersManagementComponent } from './layout/components/users-management/users-management.component';
import { ProductManagementComponent } from './layout/components/product-management/product-management.component';
import { OrdersManagementComponent } from './layout/components/orders-management/orders-management.component';
import { StaticsComponent } from './layout/components/statics/statics.component';
import { WaitListComponent } from './layout/components/wait-list/wait-list.component';
import { GetwaitlistComponent } from './layout/components/wait-list/getwaitlist/getwaitlist.component';



@NgModule({
  imports: [RouterModule.forChild([
    {
      path:'' , component:LayoutComponent ,
      children:[
        {
          path:'', component:UsersManagementComponent
        },
        {
          path:'users-management' , component:UsersManagementComponent
        },
        {
          path:'product-management' , component:ProductManagementComponent
        },
        {
          path:'wait-list' , component:WaitListComponent , children:[
            {path:'' , component:GetwaitlistComponent},
            {path:'getwaitlist' , component:GetwaitlistComponent}
          ]
        },
        {
          path:'orders-management' , component:OrdersManagementComponent
        },
        {
          path:'statics' , component:StaticsComponent
        }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
