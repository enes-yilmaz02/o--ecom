import { NgModule } from '@angular/core';
import { NavigationError, Router, RouterModule, Routes } from '@angular/router';
import { UserGuard} from './services/guard/user.guard';
import { CreoterGuard} from './services/guard/creoter.guard';
import { AdminGuard } from './services/guard/admin.guard';
import { DenemeComponent } from './pages/components/deneme/deneme.component';

const routes: Routes = [
  {
    path:'',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path:'deneme' , component:DenemeComponent
  },
  {
    path: 'pages',
    canActivate:[UserGuard],
    loadChildren: () =>import('./pages/pages.module').then((m) => m.PagesModule),
  },
  {
    path: 'creoter',
    canActivate:[CreoterGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),

  },
  {
    path: 'admin',
    canActivate:[AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'notfound',
    loadChildren: () =>
        import('./notfound/notfound.module').then(
            (m) => m.NotfoundModule
        ),
},
{ path: '**', redirectTo: '/notfound' },

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
