import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userFormRegister: FormGroup;
  name: string;
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService:UserService ,
    private router: Router
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
    if (this.userFormRegister.valid) {
      const formValuesArray = this.userFormRegister.value;
      this.userService.registerWithEmail(
          formValuesArray.name,
          formValuesArray.username,
          formValuesArray.email,
          formValuesArray.password,
          formValuesArray.confirmpassword
        )
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kayıt Başarılı.',
          });
        })
        .catch((_error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata!',
            detail: 'Beklenmeyen bir hata oluştu',
          });
          this.router.navigate(['/register']);
        });
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
