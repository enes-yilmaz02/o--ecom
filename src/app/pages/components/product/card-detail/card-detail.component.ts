import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent implements OnInit {
  productId: string;
  product: any;
  defaultValue = 1;
  productPrice: number;
  body: any;
  liked: boolean = false;
  images: string[] = [];
  selectedImageIndex: number = 0;
  quantity: number = 1;
  userId: any;
  favoritedProducts: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
    private badgeService: BadgeService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.getProductId().subscribe((productId) => {
      this.productService.patchProductById(productId).subscribe((data: any) => {
        this.product = data;
        this.productPrice = Number(this.product.priceStacked);
        this.checkIfProductIsLiked();
      });
    });
    this.route.queryParams.subscribe((params) => {
      this.liked = params['liked'] === 'true';
    });
    this.productService.getProducts().subscribe((products: any[]) => {
      this.favoritedProducts = Array(products.length).fill(false);
    });
  }

  async loadDataAsync() {
    try {
      const productId = await this.getProductId().toPromise();
      const data = await this.productService
        .patchProductById(productId)
        .toPromise();
      this.product = data;
      this.productPrice = Number(this.product.priceStacked);
      this.checkIfProductIsLiked();
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  }

  updateUrlWithLikedParam(liked: boolean) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { liked: liked.toString() },
      queryParamsHandling: 'merge',
    });
  }

  checkIfProductIsFavorites(userId: any, productId: any): Observable<boolean> {
    return this.userService.getFavoriteById(userId, productId).pipe(
      map((isProductFavorited: any) => {
        if (Object.keys(isProductFavorited).length !== 0) {
          this.userService.deleteFavoriteById(userId, productId).subscribe(
            () => {
              this.liked = false;
              this.updateUrlWithLikedParam(false);
              this.badgeService.updateFavorites();
              this.messageService.add({
                severity: 'success',
                summary: this.translocoService.translate('successMessage'),
                detail: this.translocoService.translate(
                  'cardDetail.messageDetailsuccess'
                ),
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translocoService.translate('errorMessage'),
                detail: this.translocoService.translate(
                  'cardDetail.messageDetailerror'
                ),
              });
            }
          );
          return true;
        } else {
          return false;
        }
      }),
      catchError((error) => {
        if (error.status === 404) {
          return of(false);
        } else {
          throw error;
        }
      })
    );
  }

  getFileUrl(fileName: string): string {
    if (fileName) {
      return `http://localhost:8080/files/${fileName}`;
    } else {
      return;
    }
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getProduct(productId: any): Observable<any> {
    return this.productService.patchProductById(productId);
  }

  getProductId(): Observable<string> {
    return this.route.params.pipe(map((params) => params['id']));
  }

  getSeverity(product: any) {
    switch (product?.selectedStatus) {
      case 'IS':
        return 'success';
      case 'LS':
        return 'warning';
      case 'OS':
        return 'danger';
      default:
        return null;
    }
  }

  addToCart(product: any, productId: any) {
    if (this.defaultValue >= 1) {
      if (this.defaultValue > this.product.quantity) {
        this.messageService.add({
          severity: 'warn',
          summary: this.translocoService.translate('warnMessage'),
          detail: this.translocoService.translate(
            'cardDetail.messageDetailwarn'
          ),
        });
        return;
      }
      this.getUserId().subscribe(() => {
        this.getProductId().subscribe((id) => {
          const quantityValue = this.defaultValue;
          const body = {
            id: productId,
            creoterId: this.product.creoterId,
            email: this.product.email,
            product: {
              id: id,
              ...product,
              quantity: quantityValue,
            },
          };
          this.userService
            .addCart(this.userId, id, body)
            .subscribe((response: any) => {
              if (response) {
                this.messageService.add({
                  severity: 'success',
                  summary: this.translocoService.translate('successMessage'),
                  detail: this.translocoService.translate(
                    'cardDetail.messageDetailsuccessaddcart'
                  ),
                });
                this.badgeService.updateCarts();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: this.translocoService.translate('errorMessage'),
                  detail: this.translocoService.translate(
                    'cardDetail.messageDetailerroraddcart'
                  ),
                });
              }
            });
        });
      });
    } else if (this.defaultValue === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate(
          'cardDetail.messageDetailwarnpiece'
        ),
      });
    }
    this.defaultValue = 1;
  }

  updateProductPrice(): void {
    this.productPrice = this.defaultValue * this.product?.priceStacked;
  }

  checkIfProductIsLiked() {
    this.getUserId().subscribe((userId) => {
      this.getProductId().subscribe((productId) => {
        this.userService
          .getFavoriteById(userId, productId)
          .subscribe((favorites: boolean) => {
            const index = favorites['id'];
            if (index === productId) {
              this.liked = true;
            } else {
              this.liked = false;
            }
          });
      });
    });
  }

  addToCartFavorites() {
    this.getUserId().subscribe((userId: any) => {
      this.getProductId().subscribe((productId: string) => {
        this.productService.patchProductById(productId).subscribe((product: any) => {
            this.checkIfProductIsFavorites(userId, productId).subscribe((isFavorited: boolean) => {
              if (!isFavorited) {
                  const body = {
                    id: productId,
                    product: product,
                  };
                 this.userService.addFavorite(userId, productId, body).subscribe(() => {
                   this.userService.deleteExFavorite(userId, productId).subscribe(() => {
                      this.badgeService.updateFavorites();
                      this.liked = true;
                      this.messageService.add({
                      severity: 'success',
                      summary:this.translocoService.translate('successMessage'),
                      detail: this.translocoService.translate('cardDetail.messageDetailsuccessaddfavorite')});
                    });
                  });
              }
            }
          );
        });
      });
    });
  }

  isOutOfStock(product: any): boolean {
    return product?.selectedStatus?.name === 'OUTOFSTOCK';
  }
}
