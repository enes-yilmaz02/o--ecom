import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/account/account.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { LoginComponent } from './components/main/login/login.component';
import { MainComponent } from './components/main/main.component';
import { RegisterComponent } from './components/main/register/register.component';
import { ResetpasswordComponent } from './components/main/resetpassword/resetpassword.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CardDetailComponent } from './components/product/card-detail/card-detail.component';
import { ProductComponent } from './components/product/product.component';
import { SupportComponent } from './components/support/support.component';
import { PagesComponent } from './pages.component';
import { UserinfoComponent } from './components/account/userinfo/userinfo.component';
import { UserpasswordComponent } from './components/account/userpassword/userpassword.component';
import { UsercontactComponent } from './components/account/usercontact/usercontact.component';
import { AuthGuard } from '../services/auth/auth.guard';

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
            path: '',
            component: MainComponent,
          },

          {
            path: 'account',
            component: AccountComponent,
            canActivate: [AuthGuard],
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
            canActivate: [AuthGuard],
            component: FavoritesComponent,
          },
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'register',
            component: RegisterComponent,
          },
          {
            path: 'reset-password',
            component: ResetpasswordComponent,
          },
          {
            path: 'orders',
            canActivate: [AuthGuard],
            component: OrdersComponent,
          },
          {
            path: 'product',
            canActivate: [AuthGuard],
            component: ProductComponent,
          },
          { path: 'product/:id',canActivate: [AuthGuard], component: CardDetailComponent },
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
