import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { AboutComponent } from './pages/components/about/about.component';
import { AccountComponent } from './pages/components/account/account.component';
import { FavoritesComponent } from './pages/components/favorites/favorites.component';
import { LoginComponent } from './pages/components/main/login/login.component';
import { RegisterComponent } from './pages/components/main/register/register.component';
import { ResetpasswordComponent } from './pages/components/main/resetpassword/resetpassword.component';
import { OrdersComponent } from './pages/components/orders/orders.component';
import { ProductComponent } from './pages/components/product/product.component';
import { SupportComponent } from './pages/components/support/support.component';
import { MainComponent } from './pages/components/main/main.component';
import { CardDetailComponent } from './pages/components/product/card-detail/card-detail.component';

const routes: Routes = [

  {
    path:'' , component:PagesComponent ,
     children:[
      {
        path:'' , component:MainComponent
      },

      {
        path:'account' , component:AccountComponent
      },
      {
        path:'favorites' , component:FavoritesComponent
      },
      {
        path:'login' , component:LoginComponent
      },
      {
        path:'register' , component:RegisterComponent
      },
      {
        path:'reset-password' , component:ResetpasswordComponent
      },
      {
        path:'orders' , component:OrdersComponent
      },
      {
        path:'product' , component:ProductComponent
      },
      { path: 'product/:id', component: CardDetailComponent },
      {
        path:'support' , component:SupportComponent
      },
      {
        path:'about' , component:AboutComponent
      },

    ]
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
