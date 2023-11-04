import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Customer, Representative } from 'src/app/models/customer';
import { Users } from 'src/app/models/users';
import { UserService } from 'src/app/services/user.service';
import { AdduserFormComponent } from './adduser-form/adduser-form.component';
import { UpdateuserFormComponent } from './updateuser-form/updateuser-form.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnDestroy {

  customers!: Customer[];

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  users: Users[];

  isUserDialogOpen: boolean = false;

  // userId: string= '2';

  constructor(
    private user: UserService,
    public  dialogService: DialogService,
    public  messageService: MessageService
  ) {
    this.getUsers();


  }
  ref: DynamicDialogRef | undefined;

  getUsers() {
    this.user.getUsers().subscribe((data: Users[]) => {
      this.users = data;
    });
  }

  deleteUser(email: string, password: string) {
    this.user.loginWithEmail(email, password)
      .then(() => {
        this.user.deleteUsers(email, password)
          .then(() => {
            this.getUsers();
            this.messageService.add({
              severity: 'success',
              summary: 'Başarılı!',
              detail: 'Kullanıcı başarıyla silindi.'
            });
          })
          .catch((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Hata!',
              detail: 'Kullanıcı silinirken bir hata oluştu. Lütfen tekrar deneyin.'
            });
          });
      }).finally(()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı!',
          detail: 'Kullanıcı başarıyla silindi.'
        });
      });
  }

  // getuser(id:string){
  //   this.user.getUser(id).subscribe((data:any)=>{
  //     console.log("DATA",data);
  //   })
  // }


  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    switch (status) {
      case 'unqualified':
        return 'danger';

      case 'qualified':
        return 'success';

      case 'new':
        return 'info';

      case 'negotiation':
        return 'warning';

      case 'renewal':
        return null;
    }
  }

  show() {
    this.ref = this.dialogService.open(AdduserFormComponent, {
      header: 'Orion Innovation',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  showUpdateForm() {
    this.ref = this.dialogService.open(UpdateuserFormComponent, {
      header: 'Orion Innovation',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
