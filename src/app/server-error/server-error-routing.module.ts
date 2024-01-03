import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServerErrorComponent } from './server-error.component';



@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ServerErrorComponent }
])],
  exports: [RouterModule]
})
export class ServerErrorRoutingModule { }
