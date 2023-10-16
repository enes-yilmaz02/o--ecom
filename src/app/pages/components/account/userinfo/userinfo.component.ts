import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss']
})
export class UserinfoComponent {
  accountForm:FormGroup;
  date: Date | undefined;

  constructor(private formBuilder:FormBuilder) {
    this.accountForm = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      calendar: [null, Validators.required],
      email: [null, Validators.required],
    });
  }
}
