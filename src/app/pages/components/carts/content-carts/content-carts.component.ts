import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
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
  products: any[]; // Sepetteki ürünleri içeren dizi

  totalPrice: number;

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any; //Tokenden gelen user için tanımlı değişken

  userData: any;

  creoterId: any;

  creotersData: any;

  creotersEmail: any;

  orderDate= new Date();

  orderQuantity:any;

  cart:any;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private productServie: ProductService,
    private badgeService:BadgeService
  ) {
    // Verileri alıp hesaplamaları burada yapabiliriz
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
      console.log('user Data:', this.userData); // Corrected log statement
    });
  }

  getCarts() {
    return this.userService.getCarts(this.userId).subscribe((data: any) => {


      // Extract id and quantity from each item and create a new array
      this.orderQuantity = data.map((item: any) => ({
        id: item.id,
        quantity: item.quantity
      })).flat();
      // Assign creoterId to the variable
      this.creoterId = data.map((item: any) => {
        const ids=item.creoterId;
        return ids;
      });

      // Assign the entire data to the products variable
      this.products = data.map((item:any)=>{
        const product= item.product;
        return product;
      });

      // Calculate total price and fetch creoter data
      this.calculateTotalPrice();
      this.getCroeterData();
    });
  }

  getCroeterData() {

    if (Array.isArray(this.creoterId) && this.creoterId.length > 0) {
      const creoterIds = this.creoterId;
      const requests = creoterIds.map((creoterId: any) =>
        this.userService.getUser(creoterId)
      );
      if (requests.length > 0) {
        forkJoin(requests).subscribe(
          (creotersData: any[]) => {
            this.creotersData = creotersData;

            const creoterEmails = creotersData.map(
              (creoter: any) => creoter.email
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
            summary: 'Ürün sepetten kaldırıldı',
          });
          this.getCarts();
        },
        (error) => {
          // Hata durumunda mesaj göster
          this.messageService.add({
            severity: 'error',
            summary: 'Sipariş silinemedi!',
            detail: error.error.detail || 'Bilinmeyen bir hata oluştu.',
          });
          // Hatanın nedenini konsola yazdır
          console.error('Sipariş silinemedi!', error);
        }
      );
    });
  }

  getFileUrl(fileName: string): string {
    // Update the URL template based on your file structure in Google Cloud Storage
    return `http://localhost:8080/files/${fileName}`;
  }

  sendEmail() {
    if (Array.isArray(this.creotersEmail) && this.creotersEmail.length > 0) {
      // Loop through each creoterEmail and send an email
      this.creotersEmail.forEach((email: string) => {
        const body = {
          to: email, // Include 'to' property here
          subject: 'Yeni Siparişiniz var :)',
          text:
            ' OI deki ' +
              this.userData.name +
            ' adlı kullanıcımız $' +
              this.totalPrice +
            ' değerinde yeni bir sipariş vermiştir. Bol kazançalar OI Ailesi',
        };

        // Send email for the current email address
        this.userService.sendEmailGlobal(body).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Başarılı!',
            });
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

  completeOrder() {
    // Toplam tutarı ve diğer siparişle ilgili bilgileri içeren ana sipariş nesnesini oluşturun
    const orderData = {
      totalAmount: this.totalPrice,
      orders: this.products,
      userId: this.userId,
      orderDate:this.orderDate,
    };
    this.getUserId().subscribe(() => {
      this.userService.addOrder(this.userId, orderData).subscribe(
        (response: any) => {
          if (response) {
            this.productServie.addProductOrders(orderData).subscribe(() => {
              this.sendEmail();
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Sipariş tamamlandı',
              });
              this.badgeService.emitCartUpdatedEvent();
              // Sipariş tamamlandıktan sonra sepeti boşalt
              this.clearCart();
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Başarısız',
              detail: 'Sipariş tamamlanamadı',
            });
          }
        },
        (error) => {
          // Hata durumunda mesaj göster
          console.log(error);
        }
      );
    });
  }

  clearCart() {
    this.getUserId().subscribe(() => {
      this.userService.clearCart(this.userId).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Sepet boşaltıldı',
          });

          // Sepet başarıyla temizlendikten sonra yerel verileri güncelle
          this.products = [];
          this.totalPrice = 0;
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Sepet boşaltılamadı',
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
