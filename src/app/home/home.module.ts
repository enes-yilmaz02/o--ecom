import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MessageService } from 'primeng/api';
import { CartService } from '../services/cart.service';
import {  GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ResetpasswordCodeComponent } from './reset-password/resetpassword-code/resetpassword-code.component';
import { ResetPasswordPasswordComponent } from './reset-password/reset-password-password/reset-password-password.component';
import { HttpClientModule } from '@angular/common/http';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { BecomeSellerComponent } from './become-seller/become-seller.component';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ResetpasswordCodeComponent,
    ResetPasswordPasswordComponent,
    BecomeSellerComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    HttpClientModule,

  ],
  exports:[
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
  providers:[
    CartService,
    MessageService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('614449184147-9gnmmtskp97qaccqqirdo0jfo1he55na.apps.googleusercontent.com'),
          },
        ],
      } as SocialAuthServiceConfig,
    },

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Eklendi
})
export class HomeModule { }
