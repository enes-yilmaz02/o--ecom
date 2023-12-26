
//Moduller
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

//Servisler
import { MessageService } from 'primeng/api';
import { CartService } from '../services/cart.service';
import { CitiesService } from '../services/cities.service';

//Pipelar
import { TruncatePipe } from '../services/pipes/truncate.pipe';


//Componentler
import { NavbarListComponent } from './components/navbar-list/navbar-list.component';
import { AboutComponent } from './components/about/about.component';
import { FooterComponent } from './components/footer/footer.component';
import { AccountComponent } from './components/account/account.component';
import { UsercontactComponent } from './components/account/usercontact/usercontact.component';
import { UserinfoComponent } from './components/account/userinfo/userinfo.component';
import { UserpasswordComponent } from './components/account/userpassword/userpassword.component';
import { SupportComponent } from './components/support/support.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductComponent } from './components/product/product.component';
import { CardComponent } from './components/product/card/card.component';
import { CardDetailComponent } from './components/product/card-detail/card-detail.component';
import { PagesComponent } from './pages.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DefaultContentComponent } from './components/orders/default-content/default-content.component';
import { ContentTableComponent } from './components/orders/content-table/content-table.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ContentFavoritesComponent } from './components/favorites/content-favorites/content-favorites.component';
import { DefaultFavoritesComponent } from './components/favorites/default-favorites/default-favorites.component';
import { AccountSidebarComponent } from './components/account/account-sidebar/account-sidebar.component';
import { CartsComponent } from './components/carts/carts.component';
import { ContentCartsComponent } from './components/carts/content-carts/content-carts.component';
import { DefaultCartsComponent } from './components/carts/default-carts/default-carts.component';
import { CreoterFormComponent } from './components/creoter-form/creoter-form.component';
import { DenemeComponent } from './components/deneme/deneme.component';
import { ExFavoritesComponent } from './components/favorites/ex-favorites/ex-favorites.component';


@NgModule({
  declarations: [
    NavbarListComponent,
     AboutComponent,
     FooterComponent,
     AccountComponent,
     UsercontactComponent,
     UserinfoComponent,
     UserpasswordComponent,
     SupportComponent,
     FavoritesComponent,
     OrdersComponent,
     ProductComponent,
     CardComponent,
     CardDetailComponent,
     PagesComponent,
     LoadingComponent,
     DefaultContentComponent,
     ContentTableComponent,
     ContentFavoritesComponent,
     DefaultFavoritesComponent,
     AccountSidebarComponent,
     CartsComponent,
     ContentCartsComponent,
     DefaultCartsComponent,
     CreoterFormComponent,
     TruncatePipe,
     DenemeComponent,
     ExFavoritesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    PagesRoutingModule,
  ],
  exports:[
    NavbarListComponent,
    AboutComponent,
    FooterComponent,
    AccountComponent,
    SupportComponent,
    FavoritesComponent,
    OrdersComponent,
    ProductComponent,
    PagesComponent,
    CardDetailComponent,
    LoadingComponent
  ],
  providers:[
    CartService,
    MessageService,
    CitiesService
  ]
})
export class PagesModule { }
