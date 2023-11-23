import { Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { UserRole } from 'src/app/models/role.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  userFormRegister: FormGroup;

  Genders: any[] = [
    { name: 'Male', key: 'male' },
    { name: 'Female', key: 'female' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router:Router
  ) {
    this.userFormRegister = this.formBuilder.group({
      name: ['', Validators.required],
      surname:['',Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      bDate: ['', Validators.required],
      gender: ['', Validators.required],
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

  validateNumericInput(event: any): void {
    const inputChar = String.fromCharCode(event.charCode);

    // Sayı olup olmadığını kontrol etmek için düzenli ifade kullanabilirsiniz
    const numericRegex = /^[0-9]*$/;

    if (!numericRegex.test(inputChar) || event.target.value.length >= 11) {
      // Sayı değilse veya maksimum karakter sınırına ulaşıldıysa girişi engelle
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.userFormRegister.valid) {
      const formValuesArray = this.userFormRegister.value;
      const email = formValuesArray.email;
      // Add the role property to the formValuesArray
      formValuesArray.role = UserRole.User;
      this.checkEmailAvailability(email).pipe(
        switchMap((result) => {
          if (result.available) {
            return this.userService.registerWithEmail(formValuesArray);
          } else {
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Hata',
              detail: 'Bu e-posta adresi zaten kullanılmaktadır. Lütfen başka bir e-posta adresi seçin.',
            });
            // Benzer bir e-posta adresi bulunduğunda da bir hata mesajı göster
            return EMPTY; // Boş bir Observable döndür
          }
        })
      ).subscribe({
        next: () => {
          // Başarılı kayıt mesajı göster
          this.messageService.clear();
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kayıt işlemi başarıyla tamamlandı.',
          });
          this.router.navigate(['login']);
        },
        error: (error) => {
          // Eğer hata oluşursa burada işlem yapabilirsiniz
          console.error('Kayıt başarılı, ancak bildirim gönderilemedi. Hata:', error);
        },
        complete: () => {
          // Observable tamamlandığında yapılacak işlemler
          console.log('Observable tamamlandı');
        },
      });

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
