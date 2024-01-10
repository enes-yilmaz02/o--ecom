import { Component, EventEmitter,  Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { OnChangeService } from 'src/app/services/onchange.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-ex-favorites',
  templateUrl: './ex-favorites.component.html',
  styleUrls: ['./ex-favorites.component.scss']
})
export class ExFavoritesComponent  {
  userId: any;
  products: any;
  productId:any;
  liked: boolean = true;
  @Output() allExFavoritesDeleted = new EventEmitter<void>();


  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private tranlocoService:TranslocoService,
    private productService:ProductService,
    private translocoService:TranslocoService,
    private badgeService: BadgeService,
    private onChangeService:OnChangeService
  ){
    this.getUserId().subscribe(() => {
      this.getExFavorites();
    });
    this.onChangeService.exFavoritesUpdated$.subscribe(() => {
      this.getUserId().subscribe(() => {
        this.getExFavorites();
      });
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  getExFavorites() {
    return this.userService.getExFavorites(this.userId).subscribe((data: any) => {
      this.products = data.map((item: any) => {
          const product = item;
          product.productId = item.id;
          return product;
        }).flat();
        if (this.products.length === 0) {
          this.allExFavoritesDeleted.emit();
        }
    });
  }

  deleteExFavorites(productId: any) {
    this.getUserId().subscribe(() => {
      this.userService.deleteExFavorite(this.userId, productId).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: this.tranlocoService.translate('successMessage'),
            detail:this.tranlocoService.translate('favoritesForm.messageDetailsuccess')
          });
          this.getExFavorites();
        }
      );
    });
    this.getExFavorites();
    this.onChangeService.changeExFavorites();
  }

  getProduct(productId: any): Observable<any> {
    return this.productService.patchProductById(productId);
  }

  addFavorites(productId:any){
    this.getUserId().subscribe((userId:any)=>{
      this.getProduct(productId).subscribe((product:any)=>{
        const body = {
          id: productId,
          product: product,
        };
        this.userService.addFavorite(userId, productId, body).subscribe(()=>{
          this.userService.deleteExFavorite(userId,productId).subscribe(()=>{
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('successMessage'),
              detail: this.translocoService.translate('cardDetail.messageDetailsuccessaddfavorite')
            });
            this.liked = true;
            this.badgeService.updateFavorites();
            this.getExFavorites();
            this.onChangeService.changeExFavorites();
          });
        });
      });
    });
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
