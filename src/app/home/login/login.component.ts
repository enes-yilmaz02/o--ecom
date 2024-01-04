import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { GoogleService } from 'src/app/services/auth/google.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userFormLogin: FormGroup;
  userProfile: any;
  user: any;
  userId: any;
  role: any;
  isLoggedIn$ = this.googleService.isAuthenticated();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private translocoService: TranslocoService,
    private googleService: GoogleService
  ) {}

  // Google ile giriş fonk.
  loginWithGoogle(): void {
    this.googleService.loginWithGoogle();
  }
  //Google ile giriş yapıldığında boolean dönen bir fonk.
  isAuthenticated() {
    this.googleService.isAuthenticated();
  }

  ngOnInit() {
    this.userFormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

  }

  // localstorageda ki tokeni çözdükten sonra alınan id'yi alan fonk.
  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  // userId ile kullanıcı datsını getiren fonk.
  getUserData() {
    this.getUserId().subscribe((userId: any) => {
      this.userService.getTokenUser(userId).subscribe((data: any) => {
        this.role = data;
        console.log(this.role);
      });
    });
  }

  // Giriş butonuna basılınca çalışan fonk.
  onSubmitLogin() {
    if (this.userFormLogin.valid) {
      const formValuesArray = this.userFormLogin.value;
      this.userService.loginUser(formValuesArray).subscribe(
        () => {
          //const authToken = localStorage.getItem('authToken');
          this.userService.getTokenId().subscribe(() => {
            this.getUserId().subscribe(() => {
              this.userService
                .getUserWithEmail(formValuesArray.email)
                .subscribe((data: any) => {
                  this.role = data.role;
                  console.log(this.role);
                  switch (this.role) {
                    case 'USER':
                      setTimeout(() => {
                        this.router.navigate(['pages']);
                      }, 1000);
                      break;

                    case 'CREOTER':
                      setTimeout(() => {
                        this.router.navigate(['creoter']);
                      }, 1000);
                      break;

                    case 'ADMİN':
                      setTimeout(() => {
                        this.router.navigate(['admin']);
                      }, 1000);
                      break;

                    default:
                      setTimeout(() => {
                        this.router.navigate(['notfound']);
                      }, 1000);
                      break;
                  }
                });
            });
          });
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate(
              'loginForm.messageDetailsuccess'
            ),
          });
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail: this.translocoService.translate(
              'loginForm.messageDetailerror'
            ),
          });
          console.log(error);
        }
      );
    } else {
      this.markFormGroupTouched(this.userFormLogin);
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate('loginForm.messageDetailwarn'),
      });
    }
  }

 //form elementlerinin olaylarını takip eder dirty -touched vb.
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
