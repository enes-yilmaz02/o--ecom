import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { GeneratedCodeService } from 'src/app/services/generated-code.service';
import { GetEmailService } from 'src/app/services/get-email.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  userResetForm: FormGroup;
  generatedCode: any;
  senderMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isCodeGenerated: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService:MessageService,
    private router:Router,
    private translocoService:TranslocoService,
    private generatedCodeService:GeneratedCodeService,
    private emailService:GetEmailService
  ) {
    this.userResetForm = this.formBuilder.group({
      email: ['', Validators.required],
    });

  }

  generateRandomCode(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  sendCode() {
    if(this.userResetForm.valid){
      this.generatedCode = this.generateRandomCode();
      this.isCodeGenerated = true;
      this.generatedCodeService.setGeneratedCode(this.generatedCode);
    const formValuesArray = this.userResetForm.value;
    const email = formValuesArray.email;
    this.emailService.setEmail(email);
    const body = {
      to: email,
      subject: this.translocoService.translate('changePassword'),
      text:this.translocoService.translate('changePasswordcode') + this.generatedCode,
    };
    this.userService.sendEmailGlobal(body).subscribe(
      () => {
        this.senderMail.next(true);
        this.messageService.add({
          severity: 'success',
          summary:  this.translocoService.translate('successMessage'),
          detail: this.translocoService.translate('resetForm.messageDetailsuccess'),
        });
        this.router.navigate(['/code']);
      },
      (error) => {
        console.error('Error sending email', error);
      }
    );
    }else{
      this.messageService.add({
        severity: 'error',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate('resetForm.messageDetailwarn')
      });
    }
  }
}
