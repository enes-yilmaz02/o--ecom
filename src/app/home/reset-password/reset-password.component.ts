import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  userResetForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.userResetForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }
}
