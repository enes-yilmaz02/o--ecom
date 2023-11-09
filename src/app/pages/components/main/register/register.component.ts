import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  userFormRegister: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService:UserService
  ) {
    this.userFormRegister = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone:['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    debugger
    if (this.userFormRegister.valid) {
      const formValuesArray = this.userFormRegister.value;
      this.userService.registerWithEmail(formValuesArray);
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen',
        detail: 'Form bilgilerini doldurunuz.',
      });
    }
  }

}
