import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profil-management',
  templateUrl: './profil-management.component.html',
  styleUrls: ['./profil-management.component.scss']
})
export class ProfilManagementComponent {
  profilForm:FormGroup;

  userId: any;
  selectedUser: any;
  genders: any;
  selectedGender:any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private translocoService: TranslocoService
  ) {
    this.profilForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      username: [''],
      email: [''],
      bDate: [''],
      gender: [''],
      phone: [''],
      address: [''],
    });
    this.getTokenUser();
    this.genders = [
      { name: 'Male', code: 'm' },
      { name: 'Female', code: 'fm' },
      { name: 'Another', code: 'a' },
    ];
  }


  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }
  getTokenUser() {
    this.getUserId().subscribe(() => {
      const user = this.userService
        .getUser(this.userId)
        .subscribe((userData: any) => {
          this.selectedUser = userData;
          this.profilForm.patchValue({
            name: this.selectedUser.name,
            surname: this.selectedUser.surname,
            username: this.selectedUser.username,
            email: this.selectedUser.email,
            gender: this.selectedUser.gender,
            phone: this.selectedUser.phone,
            address: this.selectedUser.address,
            password: this.selectedUser.password,
            confirmpassword: this.selectedUser.confirmpassword,
          });
          const selectedDate = new Date(this.selectedUser.bDate);
          this.profilForm.get('bDate').setValue(selectedDate);
        });
    });
  }
  updateUser() {
    if (this.profilForm.valid) {
      const formValues = this.profilForm.value;
      this.getUserId().subscribe(() => {
        this.userService.updateUser(this.userId, formValues).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate('userinfoForm.messageDetailsuccess'),
          });
        });
      });
    }
  }
}
