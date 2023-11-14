import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.scss'],
})
export class UserinfoComponent  implements OnInit{
  accountForm: FormGroup;

  date: Date | undefined;

  selectedUser: any;

  Genders: any[] = [
    { name: 'Male', key: 'male' },
    { name: 'Female', key: 'female' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.accountForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      username: [''],
      calendar: [''],
      email: [''],
      gender: [''],
      phone: [''],
      address: [''],
    });
  }

  ngOnInit(): void {
    this.getTokenUser()
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  getTokenUser() {
    const userArray = this.getToken();

    const id = userArray[0]['id'];

    const user = this.userService.getUser(id).subscribe((userData: any) => {
      this.selectedUser = userData;
      this.accountForm.patchValue({
        name: this.selectedUser.name,
        surname: this.selectedUser.surname,
        username: this.selectedUser.username,
        email: this.selectedUser.email,
        gender:this.selectedUser.gender,
        phone: this.selectedUser.phone,
        address: this.selectedUser.address,
        password: this.selectedUser.password,
        confirmpassword: this.selectedUser.confirmpassword,
      });
      console.log(this.selectedUser)
      // Set the value for the calendar control
      const selectedDate = new Date(this.selectedUser.bDate);
      this.accountForm.get('calendar').setValue(selectedDate);


    });

    console.log(user);
  }
}
