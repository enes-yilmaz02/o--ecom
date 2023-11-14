import { AuthGuard } from './services/auth/auth.guard';
import { MessageService } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { PagesModule } from './pages/pages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoModule } from '@ngneat/transloco';
import { ProductService } from './services/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './home/home.module';
import { HasRoleGuard } from './services/auth/has-role.guard';
import { AdminGuard } from './services/auth/admin.guard';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    PagesModule,
    SharedModule,
    DashboardModule,
    TranslocoModule,
    BrowserAnimationsModule,
    HomeModule
  ],
  exports: [BrowserModule],
  providers: [
    CartService,
    UserService,
    TranslocoService,
    ProductService,
    MessageService,
    AuthGuard,
    HasRoleGuard,
    AdminGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
