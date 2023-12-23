import { Component } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  showLoading = true;

  hasData = true;

  contentData: any;

  userId: any;

  constructor(private userService: UserService) {}

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
      })
    );
  }

  loadData() {
    this.getUserId().subscribe(() => {
      this.userService.getFavorites(this.userId).subscribe(
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

  handleAllFavoritesDeleted() {
    this.showLoading = true;
    setTimeout(() => {
      this.hasData = false;
      this.showLoading = false;
    }, 3000);
  }
}
