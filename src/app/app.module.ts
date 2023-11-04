import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { SharedModule } from './shared/shared.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
import { PagesModule } from './pages/pages.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { DashboardModule } from './dashboard/dashboard.module';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoModule } from '@ngneat/transloco';
import { ProductService } from './services/product.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TranslocoRootModule,
    PagesModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'reservas'),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    SharedModule,
    DashboardModule,
    TranslocoModule,
    AngularFireStorageModule,


  ],
  exports:[TranslocoModule],
  providers: [CartService,UserService,TranslocoService,ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
