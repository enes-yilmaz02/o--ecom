import { Component } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-content-carts',
  templateUrl: './content-carts.component.html',
  styleUrls: ['./content-carts.component.scss']
})
export class ContentCartsComponent {

  products: any[]; // Sepetteki ürünleri içeren dizi

  totalPrice: number;

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any ; //Tokenden gelen user için tanımlı değişken

  constructor(
    private messageService: MessageService,
    private userService:UserService,
    private productServie:ProductService
  ) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getUserId().subscribe(() => {
      this.getCarts();
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
        console.log(this.userId);
      })
    );
  }

  getCarts() {
    return this.userService.getCarts(this.userId).subscribe((data:any)=>{
      this.products = data ;
      this.calculateTotalPrice();
    })
  }

  calculateTotalPrice() {
    this.totalPrice = this.products.reduce(
      (total, item) => total + (item.priceStacked * item.quantity),
      0
    );
  }

  deleteCarts(cartId: any) {
    this.getUserId().subscribe(() => {
      this.userService.deleteCart(this.userId, cartId).subscribe(
        async () => {
          await this.messageService.add({ severity: 'success', summary: 'Ürün sepetten kaldırıldı' });
          this.getCarts();
          window.location.reload();
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

  completeOrder() {
    // Toplam tutarı ve diğer siparişle ilgili bilgileri içeren ana sipariş nesnesini oluşturun
    const orderData = {
      totalAmount: this.totalPrice,
      orders: this.products,
      userId: this.userId // Kullanıcı ID'sini ekleyin
    };
    this.getUserId().subscribe(() => {
      this.userService.addOrder(this.userId, orderData).subscribe(
        (response: any) => {
          if (response) {
            this.productServie.addProductOrders(orderData).subscribe(()=>{
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Sipariş tamamlandı',
              });
              // Sipariş tamamlandıktan sonra sepeti boşalt
            this.clearCart();
            setTimeout(() => {
              window.location.reload();
            }, 1500);
            })


          } else {
            // HTTP durum kodu başarısızsa hata mesajı göster
            this.messageService.add({
              severity: 'error',
              summary: 'Başarısız',
              detail: 'Sipariş tamamlanamadı',
            });
          }
        },
        (error) => {
          // Hata durumunda mesaj göster
          console.log(error)
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
