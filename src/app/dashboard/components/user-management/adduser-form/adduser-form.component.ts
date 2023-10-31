import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-adduser-form',
  templateUrl: './adduser-form.component.html',
  styleUrls: ['./adduser-form.component.scss']
})
export class AdduserFormComponent {
  adduserForm:FormGroup;

  constructor(private formBuilder:FormBuilder , private messageService:MessageService , private userService : UserService){
    this.adduserForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone:['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit() {

    if (this.adduserForm.valid) {
      const formValuesArray = this.adduserForm.value;
      this.userService.registerWithEmail(
          formValuesArray.name,
          formValuesArray.username,
          formValuesArray.email,
          formValuesArray.phone,
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
