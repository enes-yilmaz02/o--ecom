import { JwtHelperService, JWT_OPTIONS, JwtInterceptor } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttperrorInterceptor } from './services/interceptors/httperror.interceptor';
import { TranslocoRootModule } from './transloco-root.module';
import { ServerErrorModule } from './server-error/server-error.module';
import { JwtTokenInterceptor } from './services/interceptors/jwt-token.interceptor';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    JwtModule,
    TranslocoRootModule,
    ServerErrorModule,


  ],
  exports: [TranslocoRootModule,JwtModule],
  providers: [
    CartService,
    UserService,
    ProductService,
    MessageService,
    JwtHelperService,
    {
      provide: JWT_OPTIONS,
      useValue: JWT_OPTIONS
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttperrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true,
    },


  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
