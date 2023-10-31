import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-updateuser-form',
  templateUrl: './updateuser-form.component.html',
  styleUrls: ['./updateuser-form.component.scss']
})
export class UpdateuserFormComponent {
 updateuserForm:FormGroup;


  selectedUser: Users;

 constructor( private messageService:MessageService , private userService : UserService){

 }

 editUser(user: Users) {
  this.selectedUser = { ...user }; // Kullanıcının mevcut bilgilerini kopyala
}

updateUser(user: Users): Promise<void> {
  return this.userService.updateUsers(user);
}



}
