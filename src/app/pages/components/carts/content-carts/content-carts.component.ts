import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, forkJoin, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-content-carts',
  templateUrl: './content-carts.component.html',
  styleUrls: ['./content-carts.component.scss'],
})
export class ContentCartsComponent {
  products: any[];
  totalPrice: number;
  dataAvailable: boolean = false;
  userId: any;
  userData: any;
  creoterId: any;
  product: any;
  productId: any;
  productMaxQuantity: any;
  creotersData: any;
  creotersEmail: any;
  orderDate = new Date();
  orderQuantity: any;
  carts: any;
  productStatus: any;
  productStocks: any;
  groupedCarts: Record<string, any[]> = {};
  @Output() allCartsDeleted = new EventEmitter<void>();

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private productService: ProductService,
    private badgeService: BadgeService,
    private translocoService: TranslocoService,
    private router: Router
  ) {
    this.getUserId().subscribe(() => {
      this.getCarts();
      this.getUserData(this.userId);
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getUserData(userId: any) {
    this.userService.getUser(userId).subscribe((data: any) => {
      this.userData = data;
    });
  }

  getCarts() {
    return this.userService.getCarts(this.userId).subscribe((data: any) => {
      this.carts = data;

      this.orderQuantity = this.carts
        .map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
        }))
        .flat();

      this.creoterId = this.carts.map((item: any) => {
        const ids = item.creoterId;
        return ids;
      });

      this.products = this.carts.map((item: any) => {
        const product = item.product;
        this.productId = product.id;
        return product;
      });

      if(this.carts.length === 0){
        this.allCartsDeleted.emit();
      }

      this.calculateTotalPrice();
      this.getCroeterData();
    });
  }

  getCroeterData() {
    if (this.creoterId && this.creoterId.length > 0) {
      const creoterIds = this.creoterId;
      const requests = creoterIds.map((creoterId: any) =>
        this.userService.getUser(creoterId)
      );
      if (requests.length > 0) {
        forkJoin(requests).subscribe(
          (creotersData: any[]) => {
            this.creotersData = creotersData;

            const creoterEmails = creotersData.map(
              (creoter: any) => creoter?.email
            );
            this.creotersEmail = creoterEmails;
          },
          (error) => {
            console.error('Error fetching creoter data:', error);
          }
        );
      } else {
        console.warn('No creoterIds provided for fetching data.');
      }
    } else {
      console.warn('creoterId is not an array or is empty.');
    }
  }

  calculateTotalPrice() {
    this.totalPrice = this.products.reduce(
      (total, item) => total + item.priceStacked * item.quantity,
      0
    );
  }

  deleteCarts(cartId: any) {
    this.getUserId().subscribe(() => {
      this.userService.deleteCart(this.userId, cartId).subscribe(
        async () => {
          await this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate(
              'contentCartsForm.messageDetailsuccess'
            ),
          });
          this.getCarts();
        },
        (error) => {

          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail: this.translocoService.translate(
              'contentCartsForm.messageDetailerror'
            ),
          });

          console.error('Sipariş silinemedi!', error);
        }
      );
    });
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  sendEmail() {
    if (Array.isArray(this.creotersEmail) && this.creotersEmail.length > 0) {

      this.creotersEmail.forEach((email: string) => {
        const body = {
          to: email,
          subject: this.translocoService.translate('newOrderMessage'),
          text:
            this.translocoService.translate('contentCartsForm.customer') +
            this.userData.name +
            this.totalPrice +
            this.translocoService.translate('contentCartsForm.luckMessage'),
        };


        this.userService.sendEmailGlobal(body).subscribe(
          () => {
            console.log('satıcıya mail gönderildi');
          },
          (error) => {
            console.error('Error sending email', error);
          }
        );
      });
    } else {
      console.warn('creotersEmail is not an array or is empty.');
    }
  }

  getProduct(productId: any): Observable<any> {
    return this.productService.patchProductById(productId);
  }

  onQuantityChange(cart: any) {
    this.productService.patchProductById(cart.product.id).subscribe((data) => {
      this.product = data;
      cart.product.maxQuantity = this.product.quantity;
      this.calculateTotalPrice()
    });
  }

  completeOrder() {
    const orderData = {
      totalAmount: this.totalPrice,
      orders: this.carts,
      userId: this.userId,
      orderDate: this.orderDate,

    };
    const address = this.userData.address;
    if (address) {
      this.getUserId().subscribe(() => {
        this.userService.addOrder(this.userId, orderData).subscribe(
          (response: any) => {
            if (response) {
              this.carts.forEach((cartItem: any) => {
                this.updateProductStock(
                  cartItem.product.id,
                  cartItem.product.quantity
                );
              });

              this.productService.addProductOrders(orderData).subscribe(() => {
                this.sendEmail();
                this.messageService.add({
                  severity: 'success',
                  summary: this.translocoService.translate('successMessage'),
                  detail: this.translocoService.translate(
                    'completeOrderMessage'
                  ),
                });
                this.badgeService.emitCartUpdatedEvent();
                this.clearCart();
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translocoService.translate('errorMessage'),
                detail: this.translocoService.translate(
                  'uncompleteOrderMessage'
                ),
              });
            }
          },
          (error) => {
            // Hata durumunda mesaj göster
            console.log(error);
          }
        );
      });
    } else {
      this.router.navigate(['account/user-info']);
    }
  }

  updateProductStock(productId: any, quantity: any) {
    this.getProduct(productId).subscribe(
      (productData: any) => {
        this.productId=productData.id;
        const totalquantity = productData.quantity;
        const updatedQuantity = totalquantity - quantity;
        let selectedStatus = { name: 'INSTOCK', key: 'IS' };

        if (updatedQuantity < 20 && updatedQuantity > 0) {
          selectedStatus = { name: 'LOWSTOCK', key: 'LS' };
          const body = {
            to: productData.email,
            subject: this.translocoService.translate('contentCartsForm.stockSubject'),
            text: productData.name + this.translocoService.translate('contentCartsForm.stockUpdatedMessage')

          };
          this.userService.sendEmailGlobal(body).subscribe(()=>{
            return;
          },
          (error)=>{console.log("Error sending email", error)});
        }

        if (updatedQuantity > 20) {
          selectedStatus = selectedStatus;
        }

        if (updatedQuantity === 0) {
          selectedStatus = { name: 'OUTOFSTOCK', key: 'OS' };
          const body = {
            to: productData.email,
            subject: this.translocoService.translate('contentCartsForm.stockSubject'),
            text: productData.name + this.translocoService.translate('contentCartsForm.stockEmptydMessage')

          };
          this.userService.sendEmailGlobal(body).subscribe(()=>{
            return;
          },
          (err)=>{console.log("Error sending email", err)});
        }

        const updatedProduct = {
          ...productData,
          quantity: updatedQuantity,
          selectedStatus: selectedStatus,
        };


        this.productService.updateProduct(productId, updatedProduct).subscribe(()=>{
          console.log('ürün stoğu güncellendi');
        },(error)=>{
          console.log('ürün stoğu güncellenemedi' ,error);
        }
        )
      },
      (error: any) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  clearCart() {
    this.getUserId().subscribe(() => {
      this.userService.clearCart(this.userId).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate('allDoneOrderMessage'),
          });
          this.getCarts();
          this.badgeService.emitCartUpdatedEvent();
          this.allCartsDeleted.emit();
          this.products = [];
          this.totalPrice = 0;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail: this.translocoService.translate('unallDoneMessage'),
          });
          console.error('Sepet boşaltılamadı!', error);
        }
      );
    });
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
