import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
})
export class CartsComponent implements OnInit {
  contentData: any;
  product: any;
  dataAvailable: boolean = false;
  userId: any;
  showLoading = true;
  hasData = true;

  constructor(private userService: UserService) {
    this.getUserId().subscribe(() => {
      this.getCarts();
    });
  }


  ngOnInit() {
    this.loadData();
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getCarts() {
    return this.userService.getCarts(this.userId).subscribe((data: any) => {
      this.product = data;
    });
  }

  loadData() {
    this.getUserId().subscribe(() => {
      this.userService.getCarts(this.userId).subscribe(
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
          console.error(error);
          this.showLoading = false;
        }
      );
    });
  }

  handleAllCartsDeleted() {
    this.showLoading = true;
    setTimeout(() => {
      this.hasData = false;
      this.showLoading = false;
    }, 1000);
  }
}
