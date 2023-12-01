import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';
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
      this.checkIfProductIsLiked();
    });
  }

  updateUrlWithLikedParam(liked: boolean) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { liked: liked.toString() },
      queryParamsHandling: 'merge',
    });
  }

  checkIfProductIsLiked() {
    this.getUserId().subscribe(() => {
      this.userService.getFavorites(this.userId).subscribe((favorites: any) => {
        const isProductInFavorites = favorites.some(
          (favorite) => favorite.productId === this.product.id
        );
        this.liked = isProductInFavorites;
      });
    });
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
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

  addToCart(body: any) {
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
        this.getProductId().subscribe((productId) => {
          body.quantity = this.defaultValue;
          body.creoterId = this.product.creoterId;
          body.email = this.product.email;
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

  addToCartFavorites() {
    this.getUserId().subscribe((userId: any) => {
      this.getProductId().subscribe((productId: string) => {
        const index$ = this.productService.patchProductById(productId);
        index$.subscribe((index: number) => {
          if (index !== -1) {
            const isProductFavorited = this.favoritedProducts[index];

            // Liked durumuna göre kontrol et
            if (isProductFavorited) {
              // Eğer ürün favorideyse, silme işlemi yap
              this.userService
                .getFavorites(userId)
                .subscribe((favorites: any) => {
                  const favoriteToRemove = favorites.find(
                    (favorite: any) => favorite.productId === productId
                  );

                  if (favoriteToRemove) {
                    // Silme işlemi
                    this.userService
                      .deleteFavorite(userId, favoriteToRemove.id)
                      .subscribe(
                        () => {
                          this.favoritedProducts[index] = false;
                          this.liked = false; // Güncelleme burada
                          this.updateUrlWithLikedParam(false);
                          this.messageService.add({
                            severity: 'success',
                            summary: 'Başarılı',
                            detail: 'Favorilerden kaldırıldı',
                          });
                          this.badgeService.emitFavoritesRemovedEvent(
                            productId
                          );
                          this.badgeService.emitCartUpdatedEvent();
                        },
                        (error) => {
                          console.error(
                            'Favori kaldırma işleminde hata:',
                            error
                          );
                          this.messageService.add({
                            severity: 'error',
                            summary: 'Hata',
                            detail: 'Favori kaldırma işleminde bir hata oluştu',
                          });
                        }
                      );
                  } else {
                    console.log('Favori bulunamadı:', productId);
                    // Favori bulunamadı, isteğe bağlı olarak bir hata mesajı gösterilebilir.
                  }
                });
            } else {
              const body = {
                id: productId,
                product: this.product,
              };

              // Eğer ürün favoride değilse, ekleme işlemi yap
              this.userService
                .addFavorite(userId, productId, body)
                .subscribe(
                  () => {
                    this.favoritedProducts[index] = true;
                    this.liked = true; // Güncelleme burada
                    this.updateUrlWithLikedParam(true);
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Başarılı',
                      detail: 'Favorilere eklendi',
                    });
                    this.badgeService.emitFavoritesAddedEvent(productId);
                    this.badgeService.emitCartUpdatedEvent();
                  },
                  (error) => {
                    console.error('Favori ekleme işleminde hata:', error);
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Hata',
                      detail: 'Favori ekleme işleminde bir hata oluştu',
                    });
                  }
                );
            }
          }
        });
      });
    });
  }


  isOutOfStock(product: any): boolean {
    return product?.selectedStatus?.name === 'OUTOFSTOCK';
  }
}
