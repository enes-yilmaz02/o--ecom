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
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import {  GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { ResetpasswordCodeComponent } from './reset-password/resetpassword-code/resetpassword-code.component';
import { ResetPasswordPasswordComponent } from './reset-password/reset-password-password/reset-password-password.component';
import { HttpClientModule } from '@angular/common/http';
// import { OAuthModule } from 'angular-oauth2-oidc';
// import { GoogleService } from '../services/auth/google.service';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ResetpasswordCodeComponent,
    ResetPasswordPasswordComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    HttpClientModule,
    // OAuthModule.forRoot()
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
    // GoogleService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '614449184147-9gnmmtskp97qaccqqirdo0jfo1he55na.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Eklendi
})
export class HomeModule { }
