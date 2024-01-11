import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, EMPTY, Observable, map } from 'rxjs';
import { UserRole } from 'src/app/models/role.enum';
import { CitiesService } from 'src/app/services/cities.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-become-seller',
  templateUrl: './become-seller.component.html',
  styleUrls: ['./become-seller.component.scss']
})
export class BecomeSellerComponent implements OnInit {
  userFormSeller: FormGroup;
  generatedCode: any;
  senderMail: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  cities: any[] = [];
  distcrits: any[] = [];
  selectedCity: null;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private translocoService:TranslocoService,
    private cityService: CitiesService,
  ) {
    this.userFormSeller = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(8)]],
      companyName:['' , Validators.required],
      taxNumber:['' , [Validators.required , Validators.maxLength(11)]],
      city:['' , Validators.required],
      distcrits:['' , Validators.required],
      code: [''],
    });
  }

  ngOnInit(): void {
    this.cityService.getCities().subscribe((data) => {
      const gCities = data.city;
      this.cities = gCities.map((item: any) => {
        return { label: item.name, value: item };
      });
      this.selectedCity = null;
      this.onCityChange({ value: this.selectedCity });
    });
  }

  verifyCode() {
    const code = this.userFormSeller.get('code').value;
    if (code === this.generatedCode) {
      const formArray = this.userFormSeller.value;
      delete formArray['code'];
      formArray.role = UserRole.Creator;
      formArray.city = formArray.city.label;
      formArray.distcrits = formArray.distcrits.label;
      this.userService.addUsers(formArray).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('successMessage'),
          detail:
          this.translocoService.translate('registerForm.messageDetailsuccessverify'),
        });
        setTimeout(() => {
          localStorage.clear();
          this.router.navigate(['/login']);
        }, 1000);
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessageverify'),
        detail: this.translocoService.translate('registerForm.messageDetailerrorverify'),
      });
    }
  }

  onSubmit() {
    if (this.userFormSeller.valid) {
      this.generatedCode = this.generateRandomCode();
      const formValuesArray = this.userFormSeller.value;
      const email = formValuesArray.email;

      this.checkEmailAvailability(email).subscribe((result) => {
        if (result && result.available) {
          const body = {
            to: email,
            subject: this.translocoService.translate('emailVerifycode'),
            text: this.translocoService.translate('emailVerifyMessage') + this.generatedCode,
          };
          this.userService.sendEmailGlobal(body).subscribe(
            () => {
              this.senderMail.next(true);
              this.messageService.add({
                severity: 'success',
                summary: this.translocoService.translate('successMessage'),
                detail:this.translocoService.translate('registerForm.messageDetailsuccess'),
              });
            }
          );
        } else {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail:
            this.translocoService.translate('registerForm.messageDetailerror'),
          });
          return EMPTY;
        }
      });
    } else {
      this.messageService.clear();
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate('registerForm.messageDetailwarn'),
      });
    }
  }

   checkEmailAvailability(email: string): Observable<{ available: boolean }> {
    return this.userService.getUsers().pipe(
      map((users) => {
        const userWithEmail = users.find((user) => user.email === email);
        return { available: !userWithEmail };
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

    onCityChange(event: any): void {
      if (event && event.value) {
        const selectedCity = event.value;
        this.distcrits = selectedCity.discrits.map((district: string) => ({
          label: district,
        }));
      } else {
        this.distcrits = [];
      }
    }
}
