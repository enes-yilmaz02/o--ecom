import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, map, switchMap, tap } from 'rxjs';
import { UserRole } from 'src/app/models/role.enum';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CitiesService } from 'src/app/services/cities.service';
import { CereoterService } from 'src/app/services/cereoter.service';

@Component({
  selector: 'app-creoter-form',
  templateUrl: './creoter-form.component.html',
  styleUrls: ['./creoter-form.component.scss'],
})
export class CreoterFormComponent implements OnInit {
  creoterForm: FormGroup;

  userId: any;

  generatedCode: any;

  senderMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  cities: any[] = [];
  districts: any[] = [];
  selectedCity: any | undefined;
  userEmail: any;
  userData: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router,
    private cityService: CitiesService,
    private creoterService: CereoterService
  ) {
    this.creoterForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      taxNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      distcrits: [''],
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
      this.onCityChange({ value: this.selectedCity });
    });

    this.getUserData();
  }

  // noWhitespaceValidator(control: { value: string }): null | { whitespace: boolean } {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   return isWhitespace ? { whitespace: true } : null;
  // }

  onCityChange(event: any): void {
    if (event && event.value) {
      const selectedCity = event.value;

      // Seçilen şehir varsa ilçeleri güncelle
      this.districts = selectedCity.discrits.map((district: string) => ({
        label: district,
      }));
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

  // checkEmailAvailability(email: string): Observable<{ available: boolean }> {
  //   return this.creoterService.getCreoter().pipe(
  //     map((users) => {
  //       const userWithEmail = users.find((user) => user.email === email);
  //       return { available: !userWithEmail }; // Eğer userWithEmail değeri varsa e-posta adresi kullanılmaktadır.
  //     })
  //   );
  // }

  getUserData() {
    this.getUserId().subscribe(() => {
      this.userService.getUser(this.userId).subscribe((data: any) => {
        this.userData = data;
        this.userEmail = data.email;
        this.creoterForm.patchValue({
          email: this.userEmail,
        });
      });
    });
  }

  onSubmit() {
    if (this.creoterForm.valid) {
      this.getUserId().subscribe((userId) => {
        this.userId = userId;
        const formArray = this.creoterForm.value;
        const userData = {
          userId: this.userId,
          ...this.userData,
          companyName: formArray.companyName,
          taxNumber: formArray.taxNumber,
          city: formArray.city.label,
          distcrits: formArray.distcrits.label,
        };
        console.log(userData)
        this.creoterService.addCreoter(userData).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail:
              'Satıcı başvurunuz Fromunuz gönderildi... Onaylanınca sizi bilgilendireceğiz.',
          });
          setTimeout(() => {
            this.router.navigate(['/pages']);
          }, 3000);
        });
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen!',
        detail: 'Form bilgilerini doldurunuz..',
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
}
