import { Router } from '@angular/router';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
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

  generatedCode: any;

  senderMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  Genders: any[] = [
    { name: 'Male', key: 'male' },
    { name: 'Female', key: 'female' },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
  ) {
    this.userFormRegister = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
      code:[''],
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
  generateRandomCode(): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
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
    debugger
    if (this.userFormRegister.valid) {
      this.generatedCode = this.generateRandomCode();
      const formValuesArray = this.userFormRegister.value;
      const email = formValuesArray.email;
      formValuesArray.role = UserRole.User;
      this.checkEmailAvailability(email)
        .subscribe((result) => {
            if (result && result.available) {
              const body = {
                to: email,
                subject: 'email doğrulama',
                text: 'email doğrulama kodunuz: ' + this.generatedCode,
              };
              this.userService.sendEmailGlobal(body).subscribe(
                () => {
                  this.senderMail.next(true);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Başarılı!',
                    detail:
                      'E-posta adresinize gönderilen doğrulama kodu ile hesabınızı doğrulayabilirsiniz',
                  });
                },
                (error) => {
                  console.error('Error sending email', error);
                }
              );
              // return this.userService.registerWithEmail(formValuesArray);
            } else {
              this.messageService.clear();
              this.messageService.add({
                severity: 'error',
                summary: 'Hata',
                detail:
                  'Bu e-posta adresi zaten kullanılmaktadır. Lütfen başka bir e-posta adresi seçin.',
              });
              // Benzer bir e-posta adresi bulunduğunda da bir hata mesajı göster
              return EMPTY; // Boş bir Observable döndür
            }
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

  verifyCode(){
    const code = this.userFormRegister.get('code').value;
     if(code===this.generatedCode){
        const formArray= this.userFormRegister.value;
        delete formArray['code'];
        formArray.role = UserRole.User;
        this.userService.addUsers(formArray).subscribe(()=>{
          this.messageService.add({
            severity:'success',
            summary:'Başarılı',
            detail:"Kayıt Başarılı bir şekilde tamamlandı...Giriş ekranına yönlendiriliyorsunuz..."
          });
          setTimeout(() => {
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 3000);
        });
     }
     else{
      this.messageService.add({
        severity:'warn',
        summary:'Doğrulama kodu',
        detail:"Girdiğiniz kod doğrulanamadı... Lütfen tekrar deneyiniz"
      });
     }
  }
}
