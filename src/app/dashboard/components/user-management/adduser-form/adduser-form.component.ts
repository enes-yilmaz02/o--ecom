import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-adduser-form',
  templateUrl: './adduser-form.component.html',
  styleUrls: ['./adduser-form.component.scss'],
})
export class AdduserFormComponent {
  adduserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
  ) {
    this.adduserForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {
    if (this.adduserForm.valid) {
      const formValuesArray = this.adduserForm.value;
      this.userService.registerWithEmail(formValuesArray).subscribe((res:any)=>{
        this.messageService.add({
          severity:'success', summary:'Başarılı', detail: 'Kullanıcı başarılı bir şekilde eklendi'
        });
      },
      (error: any) => {
        this.messageService.add({
          severity:'error', summary: error?.errorMessage, detail: error?.errorDescription
        });
      }
      );
      window.location.reload();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error!',
        detail: 'Please fill all the fields',
      });
    }
  }
}
