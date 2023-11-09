import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit , Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-updateuser-form',
  templateUrl: './updateuser-form.component.html',
  styleUrls: ['./updateuser-form.component.scss'],
})
export class UpdateuserFormComponent implements OnInit {

  @Input() id: any;

  updateuserForm: FormGroup;

  selectedUser: any;

  constructor(
    private formBuilder:FormBuilder,
    private userService: UserService,
    private route:ActivatedRoute,
    private messageService:MessageService
  ) {
    this.updateuserForm =this.formBuilder.group({
      name: [''],
      username:[''],
      email: [''],
      phone: [''],
      password: [''],
      confirmpassword: [''],
    })


  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.userService.getUser(this.id).subscribe((userData: any) => {
        this.selectedUser = userData;
        this.updateuserForm.patchValue({
          name: this.selectedUser.name,
          username: this.selectedUser.username,
          email: this.selectedUser.email,
          phone: this.selectedUser.phone,
          password: this.selectedUser.password,
          confirmpassword: this.selectedUser.confirmpassword,
        });
      });
      })
  }


  editUser(id: any) {
    this.userService.getUser(id).subscribe((data: any) => {
      this.selectedUser = data;
    });
  }

  updateUser(user: any) {
    debugger
    this.route.params.subscribe((params)=>{
      this.id=params['id'];
      if (this.updateuserForm.valid) {
        const formValuesArray = this.updateuserForm.value;
        this.userService.updateUser(this.id , formValuesArray).subscribe((res:any)=>{
          this.messageService.add({
            severity:'success', summary: 'Successful!', detail: res.msg
          })
        },
        (error: any) => {
          this.messageService.add({
            severity:'error', summary: error?.errorMessage, detail: error?.errorDescription
          });
        }
        );
        window.location.reload();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error!',
          detail: 'Please fill all the fields',
        });
      }
    })

}
}
