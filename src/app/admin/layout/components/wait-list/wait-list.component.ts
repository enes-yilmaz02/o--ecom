import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { CereoterService } from 'src/app/services/cereoter.service';
import { UserRole } from 'src/app/models/role.enum';
import { MessageService } from 'primeng/api';
import { error } from 'jquery';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-wait-list',
  templateUrl: './wait-list.component.html',
  styleUrls: ['./wait-list.component.scss'],
})
export class WaitListComponent  {
  users: any;
  userId: any;
  userData: any;
  waitListId: any;

  constructor(
    private creoterService: CereoterService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.getAllCreoterUsers();
  }

  
  getAllCreoterUsers() {
    this.creoterService.getCreoters().subscribe((data: any) => {
      this.users = data;
      this.userId = this.users[0]?.userId;
      this.waitListId = this.users[0]?.id;
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getUser(this.userId).pipe(
      map((data: any) => {
        this.userData = data;
        return this.userData;
      })
    );
  }

  onSubmit() {
    const body = {
      ...this.userData,
      role: UserRole.Creator,
    };
    this.userService.updateUser(this.userId, body).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Kullanıcı rolü başarılı bir şekilde güncellendi.',
        });
        this.creoterService.deleteCreoter(this.waitListId).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kullanıcı bekleme listesinden kaldırıldı.',
          });
        });
        this.getAllCreoterUsers();
      },
      (error) => {
        this.messageService.add({
          severity: 'danger',
          summary: 'Hata!',
          detail: 'Kullanıcı rolü güncellenemedi.',
        });
        console.log(error);
      }
    );
  }
}
