import { Component } from '@angular/core';
import { GoogleService } from 'src/app/services/auth/google.service';

@Component({
  selector: 'app-deneme',
  templateUrl: './deneme.component.html',
  styleUrls: ['./deneme.component.scss']
})
export class DenemeComponent {
  isLoggedIn$ = this.googleService.isAuthenticated();

  constructor(private googleService: GoogleService) {}

  loginWithGoogle(): void {
    this.googleService.loginWithGoogle();
  }

  isAuthenticated(){
   this.googleService.isAuthenticated();
  }
}
