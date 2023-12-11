import { ResetpasswordCodeComponent } from './reset-password/resetpassword-code/resetpassword-code.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordPasswordComponent } from './reset-password/reset-password-password/reset-password-password.component';



@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: HomeComponent , children:[
      { path:'' , component:LoginComponent},
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'reset-password', component: ResetPasswordComponent , children:[
        { path:'code' , component:ResetpasswordCodeComponent},
        { path:'password' , component:ResetPasswordPasswordComponent},

      ]},
      { path:'code' , component:ResetpasswordCodeComponent},
      { path:'password' , component:ResetPasswordPasswordComponent},
    ]}
  ]
  )],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
