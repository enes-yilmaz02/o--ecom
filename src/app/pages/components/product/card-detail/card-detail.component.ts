import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private badgeService: BadgeService
  ) {}

  ngOnInit(): void {
    this.getProductId().subscribe((productId) => {
      this.productService
        .patchProductById(productId)
        .subscribe(async (data: any) => {
          this.product = await data;
          this.productPrice = Number(this.product?.priceStacked);
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
          this.liked = false;
          this.userService.deleteFavoriteById(userId, productId).subscribe(
            () => {
              this.liked = false;
              this.updateUrlWithLikedParam(false);
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Favorilerden kaldırıldı',
              });
              this.badgeService.emitFavoritesRemovedEvent(productId);
              this.badgeService.emitCartUpdatedEvent();
            },
            (error) => {
              console.error('Favori kaldırma işleminde hata:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Hata',
                detail: 'Favori kaldırma işleminde bir hata oluştu',
              });
            }
          );
          return true; // Favori var
        } else {
          return false; // Favori yok
        }
      }),
      catchError((error) => {
        // API 404 hatası döndüğünde bu kısım çalışır
        if (error.status === 404) {
          return of(false); // Favori yoksa false döndür
        } else {
          // Diğer hatalar için ise hatayı tekrar fırlat
          throw error;
        }
      })
    );
  }

  getFileUrl(fileName: string): string {
    if (!fileName) {
      // Eğer dosya adı null veya boş ise, boş bir URL döndür
      return '';
    }
    return `http://localhost:8080/files/${fileName}`;
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
        // Eğer seçilen miktar stok miktarından fazlaysa uyarı mesajı göster
        this.messageService.add({
          severity: 'warn',
          summary: 'Lütfen dikkat!',
          detail: 'Seçilen miktar, ürün adet miktarından fazla. ',
        });
        return; // Fonksiyonu burada sonlandır
      }
      this.getUserId().subscribe(() => {
        this.getProductId().subscribe((id) => {
          const quantityDefault = this.defaultValue;
          const body = {
            id: productId,
            creoterId: this.product.creoterId,
            email: this.product.email,
            product: {
              id: productId,
              ...product,
              quantity: quantityDefault,
            },
          };
          this.userService.addCart(this.userId, productId, body).subscribe(
            (response: any) => {
              if (response) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Başarılı',
                  detail: 'Ürün sepete eklendi',
                });
                this.badgeService.emitCartUpdatedEvent();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Başarısız',
                  detail: 'Ürün sepete eklenemedi',
                });
              }
            },
            (error) => {
              // Hata durumunda mesaj göster
              console.log(error);
            }
          );
        });
      });
    } else if (this.defaultValue === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Lütfen',
        detail: 'Ürün miktarı giriniz',
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
        this.productService
          .patchProductById(productId)
          .subscribe((product: any) => {
            this.checkIfProductIsFavorites(userId, productId).subscribe(
              (isFavorited: boolean) => {
               
                if (!isFavorited) {
                  const body = {
                    id: productId,
                    product: product,
                  };

                  this.userService
                    .addFavorite(userId, productId, body)
                    .subscribe(() => {
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Başarılı',
                        detail: 'Ürün Favorilerinize eklendi...',
                      });
                      this.liked = true;
                      this.badgeService.emitCartUpdatedEvent();
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
