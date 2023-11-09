import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Customer, Representative } from 'src/app/models/customer';
import { UserService } from 'src/app/services/user.service';
import { AdduserFormComponent } from './adduser-form/adduser-form.component';
import { UpdateuserFormComponent } from './updateuser-form/updateuser-form.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnDestroy{


  customers!: Customer[];

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  users: any;

  user : any;

  isUserDialogOpen: boolean = false;

  ref: DynamicDialogRef | undefined;

  constructor(
    private userService: UserService,
    public  dialogService: DialogService,
    public  messageService: MessageService,

  ) {

    this.getUsers();

  }



  getUsers() {
    this.userService.getUsers().subscribe((data:any) => {
      this.users = data;
    });
  }

  deleteUser(id:any) {
    this.userService.deleteUser(id).subscribe(()=>{
      this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Deleted Successfully'});
    });
    this.getUsers();
  }

  getuser(id:string){
    this.userService.getUser(id).subscribe((data:any)=>{
      this.user=data;

    });

  }


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

  showUpdateForm(id:any) {
    this.ref = this.dialogService.open(UpdateuserFormComponent, {
      header: 'Orion Innovation',
      width: '50%',
      height:'900px',
      position:'absolute',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: { id },
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
}
