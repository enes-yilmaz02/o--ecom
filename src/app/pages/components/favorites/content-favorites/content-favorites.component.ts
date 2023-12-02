import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable, tap, map } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { CategoryStatus } from 'src/app/services/helper/category-status.pipe';
@Component({
  selector: 'app-content-favorites',
  templateUrl: './content-favorites.component.html',
  styleUrls: ['./content-favorites.component.scss'],
  providers: [StockStatusPipe, CategoryStatus],
})
export class ContentFavoritesComponent {
  products: any;

  userId: any;

  liked: boolean = true;

  productId: any;

  deleting: boolean = false; // deleting değişkeni ekleniyor

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private badgeService: BadgeService
  ) {
    this.getUserId().subscribe(() => {
      this.getFavorites();
    });
  }
  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }
  getFavorites() {
    return this.userService.getFavorites(this.userId).subscribe((data: any) => {
      // productId değerlerini products dizisine ekle
      this.products = data
        .map((item: any) => {
          const product = item.product;
          product.productId = item.id; // productId değerini ekle
          return product;
        })
        .flat();
    });
  }

  deleteFavorites(productId: any) {
    this.getUserId().subscribe(() => {
      this.userService.deleteFavoriteById(this.userId, productId).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail:'Ürün favorilerinizden kaldırıldı...'
          });
          this.badgeService.emitCartUpdatedEvent();
          this.getFavorites();

        },
        (error) => {
          console.log(productId);
          console.log(error);

        }
      );
    });
    this.getFavorites();
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  getSeverity(product: any) {
    switch (product?.selectedStatus.name) {
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
