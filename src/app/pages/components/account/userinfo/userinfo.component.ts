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
  Genders: any[] = [
    { name: 'Male', key: 'male' },
    { name: 'Female', key: 'female' }
];
  constructor(private formBuilder:FormBuilder) {
    this.accountForm = this.formBuilder.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      username:[null , Validators.required],
      calendar: [null, Validators.required],
      email: [null, Validators.required],
      gender:[null,Validators.required],
      phone:[null,Validators.required],
      address:[null,Validators.required],
      
    });
  }

 
}
