import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resetpassword-code',
  templateUrl: './resetpassword-code.component.html',
  styleUrls: ['./resetpassword-code.component.scss']
})
export class ResetpasswordCodeComponent {
  userResetFormCode:FormGroup
  @Input() generatedCode;
  constructor(private formBuilder:FormBuilder){
    this.userResetFormCode = this.formBuilder.group({
      code: ['', Validators.required],
    });
   
   console.log(this.generatedCode);
  }

}
