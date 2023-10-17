import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent {
  userResetForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.userResetForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }
}
