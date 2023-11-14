import { NgModule } from '@angular/core';
import { NavigationError, Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth/auth.guard';
import { HasRoleGuard } from './services/auth/has-role.guard';
import { AdminGuard } from './services/auth/admin.guard';

const routes: Routes = [
  {
    path:'',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'pages',
    canActivate:[AuthGuard],
    loadChildren: () =>import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'creoter',
    canActivate:[HasRoleGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
     
  },
  {
    path: 'admin',
    canActivate:[AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationError) {
        console.error('Navigation Error:', event.error);
      }
    });
  }
}
