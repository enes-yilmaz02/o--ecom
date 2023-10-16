import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-userpassword',
  templateUrl: './userpassword.component.html',
  styleUrls: ['./userpassword.component.scss']
})
export class UserpasswordComponent {
  newpassForm:FormGroup;
  constructor(private formBuilder:FormBuilder) {
    this.newpassForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required , Validators.minLength(8)]],
      newPassword: [null, [Validators.required , Validators.minLength(8)]],
    });
  }
}
