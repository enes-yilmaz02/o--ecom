import { ActivatedRoute } from '@angular/router';
import { Component, OnInit  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-updateuser-form',
  templateUrl: './updateuser-form.component.html',
  styleUrls: ['./updateuser-form.component.scss'],
})
export class UpdateuserFormComponent implements OnInit {

  id: any;

  updateuserForm: FormGroup;

  selectedUser: any;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private formBuilder:FormBuilder,
    private userService: UserService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
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
    this.id = this.config.data.id;
    if (this.id) {
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
    }
  }

  closeDialog(updatedData: any) {
    this.ref.close(updatedData);  // Dialog kapatılırken güncellenmiş veriyi iletiyoruz
  }

  editUser(id: any) {
    this.userService.getUser(id).subscribe((data: any) => {
      this.selectedUser = data;
    });
  }

  updateUser(user: any) {
    this.userService.updateUser(user);
  }
}
