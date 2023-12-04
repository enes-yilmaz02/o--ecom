import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    NotfoundComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class NotfoundModule { }
