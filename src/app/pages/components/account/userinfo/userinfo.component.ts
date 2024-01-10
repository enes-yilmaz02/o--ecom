import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss'],
})
export class UserinfoComponent implements OnInit {
  accountForm: FormGroup;
  date: Date | undefined;
  selectedUser: any;
  userId: any;
  genders: any;
  edit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private translocoService: TranslocoService
  ) {
    this.accountForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      username: [''],
      email: [''],
      bDate: [''],
      gender: [''],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.getTokenUser();
    this.genders = [{ name: 'Male' }, { name: 'Female' }, { name: 'Another' }];
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
      this.userService.getUser(this.userId).subscribe((userData: any) => {
        this.selectedUser = userData;
        this.accountForm.patchValue({
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
        this.accountForm.get('bDate').setValue(selectedDate);
      });
    });
  }

  updateUser() {
    if (this.accountForm.valid) {
      const formValues = this.accountForm.value;
      this.getUserId().subscribe(() => {
        this.userService.updateUser(this.userId, formValues).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate(
              'userinfoForm.messageDetailsuccess'
            ),
          });
        });
      });
    }
  }

  editUser() {
    this.edit = !this.edit;
  }
}
