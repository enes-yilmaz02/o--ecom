import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Observable, tap, Subject } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-userpassword',
  templateUrl: './userpassword.component.html',
  styleUrls: ['./userpassword.component.scss'],
})
export class UserpasswordComponent implements OnInit {
  newpassForm: FormGroup;

  selectedUser: any;

  userId:any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private translocoService:TranslocoService,
    private messageService:MessageService
  ) {
    this.newpassForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required, Validators.minLength(8)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmpassword: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
     this.getUserId();
  }

  getUserId() {
    this.userService.getTokenId().subscribe(
      (id: any) => {
        this.userId = id;
      });
  }

  onSubmit(){
    const formValues = this.newpassForm.value;
    const password = formValues.currentPassword;
    this.userService.checkUserPassword(this.userId , password).subscribe((response)=>{
      const body = {
        password: formValues.password,
        confirmpassword: formValues.confirmpassword,
      };
      if (this.newpassForm.valid) {
        this.userService.updateUserPassword(this.userId, body).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
          });
        },
        (error)=>{
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
          });
          console.log(error);
        }
        );
      }else{
        this.messageService.add({
          severity: 'warn',
          summary: this.translocoService.translate('warnMessage'),
          detail:this.translocoService.translate('newPassForm.messageDetailwarn')
        });
      }
    },
    (error)=>{

      if(this.newpassForm.valid){
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate('errorMessage'),
          detail:this.translocoService.translate('newPassForm.messageDetailerror'),
        });
      }else{
        this.messageService.add({
          severity: 'warn',
          summary: this.translocoService.translate('warnMessage'),
          detail:this.translocoService.translate('newPassForm.messageDetailwarn')
        });
      }

    }

    )
  }

}
