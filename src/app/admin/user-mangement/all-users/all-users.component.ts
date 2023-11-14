import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent {

  users: any;

  user : any;

  constructor(
    private userService: UserService,
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

}
