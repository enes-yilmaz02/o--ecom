import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-content-favorites',
  templateUrl: './content-favorites.component.html',
  styleUrls: ['./content-favorites.component.scss']
})
export class ContentFavoritesComponent {

  product: any;

  userId: any;

  liked: boolean = true;

  constructor(private userService: UserService , private messageService:MessageService) {
    this.getUserId().subscribe(()=>{
      this.getFavorites();
    })
  }
  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }
  getFavorites() {
    return this.userService.getFavorites(this.userId).subscribe((data:any)=>{
      this.product=data;
    });
  }

  deleteFavorites(favoriteId:any) {

    this.getUserId().subscribe(()=>{
      this.userService.deleteFavorite(this.userId , favoriteId).subscribe(()=>{
        this.messageService.add({
          severity:'success',
          summary:'Favori silindi!',
        });
      },
      (error)=>{
        console.log(error);
      });
    });
    this.getFavorites();
  }

  getSeverity(product: any) {
    switch (product?.selectedStatus) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return null;
    }
  }
}
