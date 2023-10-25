import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsComponent } from './components/logs/logs.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
       DashboardComponent,
       LogsComponent,
       UserManagementComponent

  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:[

  ]
})
export class DashboardModule { }
