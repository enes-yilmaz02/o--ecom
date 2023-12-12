import { NgModule } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './layout/menu.component';
import { FooterComponent } from './layout/footer.component';
import { TopbarComponent } from './layout/topbar.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { ConfigComponent } from './layout/config/config.component';
import { UsersManagementComponent } from './layout/components/users-management/users-management.component';
import { ProductManagementComponent } from './layout/components/product-management/product-management.component';
import { OrdersManagementComponent } from './layout/components/orders-management/orders-management.component';
import { StaticsComponent } from './layout/components/statics/statics.component';
import { GetUsersComponent } from './layout/components/users-management/get-users/get-users.component';
import { MessageService } from 'primeng/api';
import { GetProductsComponent } from './layout/components/product-management/get-products/get-products.component';
import { GetOrdersComponent } from './layout/components/orders-management/get-orders/get-orders.component';
import { WaitListComponent } from './layout/components/wait-list/wait-list.component';
import { GetwaitlistComponent } from './layout/components/wait-list/getwaitlist/getwaitlist.component';
import { TRANSLOCO_CONFIG, translocoConfig } from '@ngneat/transloco';
@NgModule({
  declarations: [
    AdminComponent,
    LayoutComponent,
    MenuComponent,
    FooterComponent,
    TopbarComponent,
    SidebarComponent,
    ConfigComponent,
    UsersManagementComponent,
    ProductManagementComponent,
    OrdersManagementComponent,
    StaticsComponent,
    GetUsersComponent,
    GetProductsComponent,
    GetOrdersComponent,
    WaitListComponent,
    GetwaitlistComponent,
  ],
  imports: [AdminRoutingModule, CommonModule, SharedModule],
  providers: [MessageService, KeyValuePipe],
})
export class AdminModule {}
