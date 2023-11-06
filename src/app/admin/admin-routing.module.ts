import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';



@NgModule({
  imports: [RouterModule.forChild([
    {
      path:'' , component:AdminComponent ,
      children:[
        //{path:'',redirectTo:'dashboard' },
      ]
    }
  ])],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
