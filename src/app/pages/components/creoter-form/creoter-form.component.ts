import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject,  Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CitiesService } from 'src/app/services/cities.service';
import { CereoterService } from 'src/app/services/cereoter.service';
import { TranslocoService } from '@ngneat/transloco';

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
    private creoterService: CereoterService,
    private translocoService:TranslocoService
  ) {
    this.creoterForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      taxNumber: ['', [Validators.required, Validators.minLength(11) , Validators.maxLength(11)]],
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

  onCityChange(event: any): void {
    if (event && event.value) {
      const selectedCity = event.value;
      this.districts = selectedCity.discrits.map((district: string) => ({
        label: district,
      }));
    } else {
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
            summary: this.translocoService.translate('successMessage'),
            detail:this.translocoService.translate('creoterForm.messageDetailsuccess')
          });
          setTimeout(() => {
            this.router.navigate(['/pages']);
          }, 3000);
        });
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate('creoterForm.messageDetailwarn'),
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
