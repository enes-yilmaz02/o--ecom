import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userFormLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {
    this.userFormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmitLogin() {

    if (this.userFormLogin.valid) {
      const formValuesArray = this.userFormLogin.value;
      this.userService.loginUser(formValuesArray).subscribe(
        (response) => {
          const authToken = localStorage.getItem('authToken');
          // this.authService.login();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful login!',
            detail: 'You have successfully logged in.',
          });
          setTimeout(() => {
            this.router.navigate(['pages']);
          }, 1000);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Giriş yapılamadı. Kullanıcı adı veya şifre hatalı.',
          });
        }
      );
    } else {
      this.markFormGroupTouched(this.userFormLogin);
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen',
        detail: 'Form bilgilerini doldurunuz',
      });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
