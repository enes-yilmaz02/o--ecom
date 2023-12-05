import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, map, switchMap, tap } from 'rxjs';
import { UserRole } from 'src/app/models/role.enum';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CitiesService } from 'src/app/services/cities.service';


@Component({
  selector: 'app-creoter-form',
  templateUrl: './creoter-form.component.html',
  styleUrls: ['./creoter-form.component.scss'],
})
export class CreoterFormComponent implements OnInit {

  creoterForm: FormGroup;

  userId: any;

  generatedCode:any;

  senderMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  cities: any[] = [];
  districts: any[] = [];
  selectedCity: any | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService:MessageService,
    private router:Router,
    private cityService:CitiesService

  ) {
    this.creoterForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      taxNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      discrits: [''],
      code: [''],
    });
  }
  ngOnInit(): void {
    this.cityService.getCities().subscribe((data) => {
      const gCities = data.city;

      this.cities = gCities.map((item: any) => {
        return { label: item.name, value: item }; // Şehir objesini tamamen al
      });

      this.selectedCity = null; // Varsayılan olarak seçili şehir null olsun

      // Sehir seçildiğinde ilçeleri güncelle
      this.onCityChange({ value: this.selectedCity});
     
    });
  }
  
  // noWhitespaceValidator(control: { value: string }): null | { whitespace: boolean } {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   return isWhitespace ? { whitespace: true } : null;
  // }

  onCityChange(event: any): void {
    if (event && event.value) {
      const selectedCity = event.value;
  
      // Seçilen şehir varsa ilçeleri güncelle
      this.districts = selectedCity.discrits.map((district: string) => ({ label: district }));
    } else {
      // Seçilen şehir yoksa ilçeleri temizle
      this.districts = [];
    }
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
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
    if (this.creoterForm.valid) {
      this.generatedCode = this.generateRandomCode();
      const email = this.creoterForm.get('email').value;

      this.checkEmailAvailability(email).subscribe(result => {
        if (result && result.available) {
          const body = {
            to: email,
            subject: 'email doğrulama',
            text: 'email doğrulama kodunuz: ' + this.generatedCode,
          };
          this.getUserId().subscribe(userId => {
            this.userId = userId;
            this.userService.sendEmail(this.userId, body).subscribe(
              () => {
                this.senderMail.next(true);
                this.messageService.add({
                  severity: 'success',
                  summary: 'Başarılı!',
                  detail: 'E-posta adresinize gönderilen doğrulama kodu ile hesabınızı doğrulayabilirsiniz'
                });
              },
              error => {
                console.error('Error sending email', error);
              }
            );
          });
        }else{
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Bu e-posta adresi zaten kullanılmaktadır. Lütfen başka bir e-posta adresi seçin.',
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen!',
        detail: 'Form bilgilerini doldurunuz..'
      });
    }
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

  verifyCode(){
    const code = this.creoterForm.get('code').value;
     if(code===this.generatedCode){
      this.getUserId().subscribe(()=>{
        const formArray= this.creoterForm.value;
        delete formArray['code'];
        formArray.role = UserRole.Creator;
        this.userService.updateUser(this.userId,formArray).subscribe(()=>{
          this.messageService.add({
            severity:'success',
            summary:'Başarılı',
            detail:"Artık bir satıcısınız... Şimdi giriş sayfasına yönlendiriliyorsunuz"
          });
          setTimeout(() => {
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 3000);
        });
      })
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
