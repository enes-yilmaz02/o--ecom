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
      console.log(this.userData);
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

  // Diğer fonksiyonları ekleyin

  showAddUserDialog() {
    this.newUser = {}; // Yeni kullanıcı verilerini temizle
    this.displayAddUserDialog = true; // Yeni kullanıcı ekleme formunu göster
  }

  addUser() {
    // Yeni kullanıcı eklemek için servisi kullanın
    this.userService.addUsersAdmin(this.newUser).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary:  this.translocoService.translate('successMessage'),
          detail:  this.translocoService.translate('aGetUser.messageDetailsuccessadduser'),
        });
        this.displayAddUserDialog = false; // Yeni kullanıcı ekleme formunu kapat
        this.getAllUsers(); // Tabloyu güncelle
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
          detail: this.translocoService.translate('aGetUser.messageDetailsuccessdeleteduser'),
        });
        this.getAllUsers(); // Tabloyu güncelle
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
    // Yeni kullanıcı ekleme işlemini iptal etme
    this.displayAddUserDialog = false;
    this.resetNewUser();
  }

  resetNewUser() {
    // Yeni kullanıcı bilgilerini sıfırlama
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
