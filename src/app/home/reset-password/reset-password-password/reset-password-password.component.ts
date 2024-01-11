import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { GetEmailService } from 'src/app/services/get-email.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password-password',
  templateUrl: './reset-password-password.component.html',
  styleUrls: ['./reset-password-password.component.scss'],
})
export class ResetPasswordPasswordComponent implements OnInit {
  userResetFormPassword: FormGroup;
  email: any;
  userData: any;
  userId: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private emailService: GetEmailService,
    private messageService: MessageService,
    private translocoService:TranslocoService,
    private router:Router
  ) {
    this.userResetFormPassword = this.formBuilder.group({
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.email = this.emailService.getEmail();
    this.getUserEmail();
  }

  getUserEmail() {
    this.userService.getUserWithEmail(this.email).subscribe((data: any) => {
      this.userData = data;
      this.userId = this.userData.id;
    });
  }

  onChangesPassword() {
    const formValues = this.userResetFormPassword.value;
    const body = {
      password: formValues.password,
      confirmpassword: formValues.confirmpassword,
    };
    if (this.userResetFormPassword.valid) {
      this.userService.updateUserPassword(this.userId, body).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('successMessage'),
          detail: this.translocoService.translate('detailMessagesuccessRS'),
        });
        this.router.navigate(['/login'])
      },
      (error)=>{
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate('errorMessage'),
          detail: this.translocoService.translate('detailMessageerrorRS'),
        });
      }
      );
    }
  }
}
