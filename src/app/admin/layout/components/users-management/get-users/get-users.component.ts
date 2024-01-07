import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService, SelectItem } from 'primeng/api';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.scss'],
})
export class GetUsersComponent {
  userData: any;

  clonedUser: { [s: string]: any } = {};

  newUser: any = {};

  displayAddUserDialog: boolean = false;

  roleOptions: SelectItem[] = [
    { label: 'User', value: 'USER' },
    { label: 'Creator', value: 'CREOTER' },
    { label: 'Admin', value: 'ADMİN' },
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private translocoService:TranslocoService
  ) {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.userData = data;
    });
  }

  onRowEditInit(user: any) {
    this.clonedUser[user.id as string] = { ...user };
  }

  onRowEditSave(user: any) {
    this.userService.updateUser(user.id, user).subscribe(
      () => {
        delete this.clonedUser[user.id as string];
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('successMessage'),
          detail: this.translocoService.translate('aGetUser.messageDetailsuccess'),
        });
      },
      (error) => {
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary:this.translocoService.translate('errorMessage'),
          detail:  this.translocoService.translate('aGetUser.messageDetailerror'),
        });
      }
    );
  }

  onRowEditCancel(user: any, index: number) {
    this.userData[index] = this.clonedUser[user.id as string];
    delete this.clonedUser[user.id as string];
  }



  showAddUserDialog() {
    this.newUser = {};
    this.displayAddUserDialog = true;
  }

  addUser() {

    this.userService.addUsersAdmin(this.newUser).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary:  this.translocoService.translate('successMessage'),
          detail:  this.translocoService.translate('aGetUser.messageDetailsuccessadduser'),
        });
        this.displayAddUserDialog = false;
        this.getAllUsers();
      },
      (error) => {
        console.error('Error adding user:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate('errorMessage'),
          detail:  this.translocoService.translate('aGetUser.messageDetailerroradduser'),
        });
      }
    );
  }

  deleteUser(user: any) {
    this.userService.deleteUser(user.id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('successMessage'),
          detail: this.translocoService.translate('aGetUser.messageDetailsuccessdeleteuser'),
        });
        this.getAllUsers();
      },
      (error) => {
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate('errorMessage'),
          detail: this.translocoService.translate('aGetUser.messageDetailerrordeleteuser'),
        });
      }
    );
  }

  cancelAddUser() {
    this.displayAddUserDialog = false;
    this.resetNewUser();
  }

  resetNewUser() {
    this.newUser = {};
  }

  getSeverity(role: string) {
    switch (this.userData.role) {
      case 'USER':
        return 'info';

      case 'CREOTER':
        return 'warning';

      case 'ADMİN':
        return 'danger';

      case 'renewal':
        return null;
    }
  }
}
