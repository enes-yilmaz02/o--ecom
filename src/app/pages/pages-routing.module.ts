import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CardDetailComponent } from './components/product/card-detail/card-detail.component';
import { ProductComponent } from './components/product/product.component';
import { SupportComponent } from './components/support/support.component';
import { PagesComponent } from './pages.component';
import { UserinfoComponent } from './components/account/userinfo/userinfo.component';
import { UserpasswordComponent } from './components/account/userpassword/userpassword.component';
import { UsercontactComponent } from './components/account/usercontact/usercontact.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PagesComponent,
        children: [
          {
            path:'' , component:ProductComponent
          },
          {
            path: 'account',
            component: AccountComponent,
            children:[
              {
                path:'' , component:UserinfoComponent
              },
              {
                path:'change-password' , component:UserpasswordComponent
              },
              {
                path:'user-info' , component:UserinfoComponent
              },
              {
                path:'user-contact' , component:UsercontactComponent
              }
            ]
          },
          {
            path: 'favorites',
            component: FavoritesComponent,
          },
          {
            path: 'orders',
            component: OrdersComponent,
          },
          {
            path: 'product',
            component: ProductComponent,
          },
          { path: 'product/:id', component: CardDetailComponent },
          {
            path: 'support',
            component: SupportComponent,
          },
          {
            path: 'about',
            component: AboutComponent,
          },
        ],
      },
    ]),
  ],
})
export class PagesRoutingModule {}
