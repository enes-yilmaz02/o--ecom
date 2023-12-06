import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound.component';
import { SharedModule } from '../shared/shared.module';
import { NotfoundRoutingModule } from './notfound-routing.module';

@NgModule({
  declarations: [
    NotfoundComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NotfoundRoutingModule
  ],
  exports:[
    NotfoundComponent
  ]
})
export class NotfoundModule { }
