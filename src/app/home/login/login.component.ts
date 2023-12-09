import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
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
  userId:any;
  role:any;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private authService: SocialAuthService,
    private translocoService:TranslocoService
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

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getUserData(){
    this.getUserId().subscribe((userId:any)=>{
      this.userService.getTokenUser(userId).subscribe((data:any)=>{
        this.role= data;
        console.log(this.role);
      });
    });
  }

  
  onSubmitLogin() {
    if (this.userFormLogin.valid) {
      const formValuesArray = this.userFormLogin.value;
      this.userService.loginUser(formValuesArray).subscribe(
        (response) => {
          const authToken = localStorage.getItem('authToken');
          this.userService.getTokenId().subscribe(()=>{
            this.getUserId().subscribe(()=>{
               this.userService.getUserWithEmail(formValuesArray.email).subscribe((data:any)=>{
                this.role=data.role;
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
            })
          });
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate('loginForm.messageDetailsuccess'),
          });
          
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail: this.translocoService.translate('loginForm.messageDetailerror'),
          });
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
