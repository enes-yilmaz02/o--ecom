import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Observable, map, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
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

  checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.userService.getUsers().pipe(
      map((users) => {
        const userWithEmail = users.find((user) => user.email === email);
        return { available: !userWithEmail }; // Eğer userWithEmail değeri varsa e-posta adresi kullanılmaktadır.
      })
    );
  }



  onSubmit() {
    if (this.adduserForm.valid) {
      const formValuesArray = this.adduserForm.value;
      const email = formValuesArray.email;

      this.checkEmailAvailability(email).pipe(
        switchMap((result) => {
          if (result.available) {
            return this.userService.registerWithEmail(formValuesArray);
          } else {
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Hata',
              detail:
                'Bu e-posta adresi zaten kullanılmaktadır. Lütfen başka bir e-posta adresi seçin.',
            });
            // Benzer bir e-posta adresi bulunduğunda da bir hata mesajı göster
            return [];
          }
        }),
        // İkinci bir subscribe bloğu ekleyerek kayıt başarılı olduğunda bildirimi alabilirsiniz
      ).subscribe(
        () => {
          // Başarılı kayıt mesajı göster
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kayıt işlemi başarıyla tamamlandı.'
          });
          window.location.reload();
        },
        (error) => {
          // Eğer hata oluşursa burada işlem yapabilirsiniz
          console.error('Kayıt başarılı, ancak bildirim gönderilemedi. Hata:', error);
        }
      );
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Form bilgilerini giriniz.',
      });
    }
  }
}
