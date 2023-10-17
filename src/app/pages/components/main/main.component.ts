import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  loginPanel=true;
  registerPanel=true;
  resetPanel=false;
  constructor() {}
  toggleResetPass(){
    this.loginPanel = false;
    this.registerPanel = false;
    this.resetPanel = true;
  }

}
