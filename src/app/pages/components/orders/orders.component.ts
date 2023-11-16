import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, empty, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  showLoading = true;

  hasData = true;

  contentData: any;

  userId: any;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadData();
    // 5 saniye sonra "loading" şablonunu gizle
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
        console.log(this.userId);
      })
    );
  }

  loadData() {
    this.getUserId().subscribe(()=>{
      this.userService.getOrders(this.userId).subscribe(
        (data: any) => {
          this.contentData = data;
          if (data != null && empty) {
            this.hasData = true;
          } else {
            this.hasData = false;
          }
          this.showLoading = false;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata!',
            detail: error.error.detail,
          });
          this.showLoading = false;
        }
      );
    })
  }
}
