import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
declare var handleSignout: any; // Declare the global function to avoid TypeScript errors

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  userFormLogin: FormGroup;
  userProfile: any;
  user:any;
  loggedIn:any;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private authService: SocialAuthService
    ) {}

  ngOnInit() {
    this.userFormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      console.log(user)
      if (this.loggedIn) {
        // Kullanıcı giriş yaptı, uygulamanızda kayıtlı mı kontrol et
        this.userService.checkIfUserExists(user.email).subscribe(
          (exists) => {
            if (!exists) {
              // Kullanıcı kayıtlı değil, kayıt işlemi gerçekleştir
              this.userService.registerUser({
                email: user.email,
                // Diğer kullanıcı bilgilerini ekleyebilirsiniz
              }).subscribe(
                (response) => {
                  console.log('Kullanıcı başarıyla kaydedildi.');
                },
                (error) => {
                  console.error('Kullanıcı kaydı sırasında bir hata oluştu.');
                }
              );
            }
          },
          (error) => {
            console.error('Kullanıcı kaydı sırasında bir hata oluştu.');
          }
        );
      }
    });
  }

  handleSignOut() {
    handleSignout();
    sessionStorage.removeItem("loggedInUser");
    this.router.navigate(["/login"]).then(() => {
      window.location.reload();
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
            detail: 'Giriş işlemi başarılı...',
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
