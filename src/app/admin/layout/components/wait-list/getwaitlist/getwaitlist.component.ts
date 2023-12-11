import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { UserRole } from 'src/app/models/role.enum';
import { CereoterService } from 'src/app/services/cereoter.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-getwaitlist',
  templateUrl: './getwaitlist.component.html',
  styleUrls: ['./getwaitlist.component.scss'],
})
export class GetwaitlistComponent {
  users: any;
  userId: any;
  userData: any;
  waitListId: any;
  userIds:any;
  waitlistLoading: boolean = true;
  constructor(
    private creoterService: CereoterService,
    private userService: UserService,
    private messageService: MessageService,
    private translocoService:TranslocoService
  ) {
    this.getAllCreoterUsers();
  }

  getAllCreoterUsers() {
    this.creoterService.getCreoters().subscribe((data: any) => {
      this.users = data.map((item: any) => ({
        id:item.id,
        userId: item.userId,
        email: item.email,
        companyName: item.companyName,
        taxNumber: item.taxNumber,
        role: item.role,
      }));
          this.userId = this.users[0]?.userId;
         this.waitListId = this.users[0]?.id;
         this.getUserId(this.userId);
         this.waitlistLoading=false;
    },
    (error)=>{
      console.log(error)
      this.waitlistLoading=true;
    }

    );
  }


  getUserId(userId:any) {
    this.userService.getUser(userId).subscribe((data: any) => {
      this.userData = data;

    });
  }

  onSubmit() {
    // Assuming you want to update the first user in the array
    const userToUpdate = this.users[0];

    const body = {
      ...this.userData,
      role: UserRole.Creator,
      userId: userToUpdate.userId,
      companyName: userToUpdate.companyName,
      taxNumber: userToUpdate.taxNumber,
    };

    this.userService.updateUser(this.userId, body).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('succesMessage'),
          detail: this.translocoService.translate('aGetList.messageDetailsuccess'),
        });

        if (this.users.length > 0) {
          this.creoterService.deleteCreoter(this.waitListId).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('succesMessage'),
              detail: this.translocoService.translate('aGetList.messageDetailsuccessdeleteuser'),
            });
          });
        }

        this.getAllCreoterUsers();
      },
      (error) => {
        this.messageService.add({
          severity: 'danger',
          summary: this.translocoService.translate('errorMessage'),
          detail: this.translocoService.translate('aGetList.messageDetailerrordeleteuser')
        });
        console.log(error);
      }
    );
  }

  onDelete(userId:any) {
    console.log(userId);
    this.creoterService.deleteCreoter(userId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('succesMessage'),
          detail: this.translocoService.translate('aGetList.messageDetailsuccessdeleteuser'),
        });
        this.getAllCreoterUsers();
      },
      (error) => {
        this.messageService.add({
          severity: 'danger',
          summary:this.translocoService.translate('errorMessage') ,
          detail: this.translocoService.translate('aGetList.messageDetailerrordeleteuser'),
        });
        console.log(error);
      }
    );
  }

}
