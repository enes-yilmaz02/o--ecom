import { AuthService } from 'src/app/services/auth/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-userpassword',
  templateUrl: './userpassword.component.html',
  styleUrls: ['./userpassword.component.scss'],
})
export class UserpasswordComponent {
  newpassForm: FormGroup;

  selectedUser: any;

  constructor(
    private formBuilder: FormBuilder,
    // private authService: AuthService,
    // private userService: UserService,
    // private router : Router
  ) {
    this.newpassForm = this.formBuilder.group({
      currentPassword: [null, [Validators.required, Validators.minLength(8)]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmpassword: [null, [Validators.required, Validators.minLength(8)]],
    });
  }


  // async checkPassword() {
  //   const userArray = this.getToken();
  //   if(userArray){
  //     const id = userArray[0]['id'];
  //     const user = await this.userService
  //       .getUser(id)
  //       .subscribe((userData: any) => {
  //         this.selectedUser = userData;
  //         //console.log(this.selectedUser);
  //         const storedHashedPassword = this.selectedUser.password;
  //         const enteredCurrentPassword =
  //           this.newpassForm.get('currentPassword').value;
  //         bcrypt.compare(
  //           enteredCurrentPassword,
  //           storedHashedPassword,
  //           (err, result) => {
  //             if (result) {
  //               // const formValues = this.newpassForm.value;
  //               // this.userService.updateUser(id, formValues);
  //               console.log('Passwords do match');
  //             } else {
  //               // Passwords don't match, handle accordingly
  //               console.log('Passwords do not match');
  //             }
  //           }
  //         );
  //       });
  //   }else{
  //     this.router.navigate(['login']);
  //   }
  // }
}
