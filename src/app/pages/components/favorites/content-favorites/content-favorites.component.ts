import { MessageService } from 'primeng/api';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Observable, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { CategoryStatus } from 'src/app/services/helper/category-status.pipe';
import { TranslocoService } from '@ngneat/transloco';
import { OnChangeService } from 'src/app/services/onchange.service';
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
  @Output() allFavoritesDeleted = new EventEmitter<void>();

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private badgeService: BadgeService,
    private tranlocoService:TranslocoService,
    private onChangeService:OnChangeService
  ) {
    this.getUserId().subscribe(() => {
      this.getFavorites();
    });
    this.onChangeService.exFavoritesUpdated$.subscribe(()=>{
      this.getUserId().subscribe(() => {
        this.getFavorites();
      });
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
    return this.userService.getFavorites(this.userId).subscribe((data: any) => {
      this.products = data
        .map((item: any) => {
          const product = item.product;
          product.productId = item.id;
          return product;
        })
        .flat();
        if (this.products.length === 0) {
          this.allFavoritesDeleted.emit();
        }
    });
  }

  deleteFavorites(productId: any , product:any) {
    this.getUserId().subscribe(() => {
      this.userService.addExFavorite(this.userId, productId , product).subscribe(
        () => {
          this.userService.deleteFavorite(this.userId , productId ).subscribe(()=>{
            this.messageService.add({
              severity: 'success',
              summary: this.tranlocoService.translate('successMessage'),
              detail:this.tranlocoService.translate('favoritesForm.messageDetailsuccess')
            });
            this.liked=false;
            this.badgeService.updateFavorites();
            this.getFavorites();
            this.onChangeService.changeExFavorites();
          });
        },
        (error) => {
          console.log(productId);
          console.log(error);
        }
      );
    });
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
