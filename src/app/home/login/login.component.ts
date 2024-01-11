import {  SocialUser } from '@abacritt/angularx-social-login';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

import { MessageService } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';
import { UserRole } from 'src/app/models/role.enum';
import { UserService } from 'src/app/services/user.service';
declare var google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit , AfterViewInit {
  userFormLogin: FormGroup;
  userProfile: any;
  user: any;
  userId: any;
  role: any;
  auth2: any;
  socialUser!: SocialUser;




  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private translocoService: TranslocoService,

  ) {}

  ngAfterViewInit(): void {
   google.accounts.id.initialize({
      client_id: "614449184147-9gnmmtskp97qaccqqirdo0jfo1he55na.apps.googleusercontent.com",
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "medium" , type:"button"}
    );
  }



  ngOnInit() {
    this.userFormLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  handleGoogleSignIn(response: any) {
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const email = JSON.parse(jsonPayload).email;
    const name = JSON.parse(jsonPayload).given_name;
    const surname = JSON.parse(jsonPayload).family_name;
    const role = UserRole.User;
    this.checkEmailAvailability(email).subscribe((result)=>{
      if(result && result.available){
        const body = {
          name:name,
          surname:surname,
          email:email,
          role:role
        }
        this.userService.addUsersAdmin(body).subscribe(() => {
          this.userService.loginUserWithEmail(body.email).subscribe(
            () => {
              this.userService.getTokenId().subscribe(() => {
                this.getUserId().subscribe(() => {
                  this.userService
                    .getUserWithEmail(body.email)
                    .subscribe((data: any) => {
                      this.role = data.role;

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

            }
          );
        });
      }else{
        this.userService.loginUserWithEmail(email).subscribe(
          () => {
            this.userService.getTokenId().subscribe(() => {
              this.getUserId().subscribe(() => {
                this.userService
                  .getUserWithEmail(email)
                  .subscribe((data: any) => {
                    this.role = data.role;

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
      }
    })
  }



  //bu fonk db de users collectionda bu email var mı yok mu kontrol ediyor ve bir boolean değer dönüyor
  checkEmailAvailability(email: any): Observable<{ available: boolean }> {
    return this.userService.getUsers().pipe(
      map((users) => {
        const userWithEmail = users.find((user) => user.email === email);
        return { available: !userWithEmail };
      })
    );
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
          this.userService.getTokenId().subscribe(() => {
            this.getUserId().subscribe(() => {
              this.userService
                .getUserWithEmail(formValuesArray.email)
                .subscribe((data: any) => {
                  this.role = data.role;

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
