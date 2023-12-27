import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
  ) {}

  ngOnInit() {
    this.loadData();

    setTimeout(() => {
      this.showLoading = false;
    }, 1000);
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
  this.getUserId().subscribe(() => {
    this.userService.getOrders(this.userId).subscribe(
      (data: any) => {
        this.contentData = data;
        if (data != null && data.length > 0) {
          this.hasData = true;
        } else {
          this.hasData = false;
        }
        this.showLoading = false;
      },
      (error) => {
        console.log(error);
        this.showLoading = false;
      }
    );
  });
}

}
