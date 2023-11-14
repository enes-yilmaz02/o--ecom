import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { UserMangementComponent } from './user-mangement/user-mangement.component';
import { AddUserComponent } from './user-mangement/add-user/add-user.component';
import { UpdateUserComponent } from './user-mangement/update-user/update-user.component';
import { UserSidebarComponent } from './user-mangement/user-sidebar/user-sidebar.component';
import { AllUsersComponent } from './user-mangement/all-users/all-users.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from '../shared/shared.module';
@NgModule({
  declarations: [
    AdminComponent,
    UserMangementComponent,
    AddUserComponent,
    UpdateUserComponent,
    UserSidebarComponent,
    AllUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    TranslocoModule,
    SharedModule
  ]
})
export class AdminModule { }
