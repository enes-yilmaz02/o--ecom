import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserMangementComponent } from './user-mangement/user-mangement.component';



@NgModule({
  imports: [RouterModule.forChild([
    {
      path:'' , component:AdminComponent ,
      children:[
        {
          path:'' , component:UserMangementComponent
        }
      ]
    }
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
