import { JwtHelperService,JWT_OPTIONS  } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { PagesModule } from './pages/pages.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoModule } from '@ngneat/transloco';
import { ProductService } from './services/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttperrorInterceptor } from './services/interceptors/httperror.interceptor';

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
    JwtModule,

    
  ],
  exports: [TranslocoModule,JwtModule],
  providers: [
    CartService,
    UserService,
    TranslocoService,
    ProductService,
    MessageService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttperrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
