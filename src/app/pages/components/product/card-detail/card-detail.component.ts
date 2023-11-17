import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss'],
})
export class CardDetailComponent  implements OnInit {

  productId: string;

  product: any;

  defaultValue = 0;

  productPrice: number;

  body:any;

  liked: boolean = false;

  images: string[] = [];

  selectedImageIndex: number = 0;

  quantity: number = 1;

  userId: any ;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageService: MessageService,
    private userService:UserService
  ) {
  }


  ngOnInit(): void {
    this.getProductId().subscribe(productId => {
      this.productService.patchProductById(productId).subscribe(async (data: any) => {
        this.product = await data;
        this.productPrice = Number(this.product?.priceStacked);
      });
    });
  }

  getFileUrl(fileName: string): string {
    // Update the URL template based on your file structure in Google Cloud Storage
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
      return this.route.params.pipe(
        map(params => params['id'])
      );
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

  addToCart(body:any) {
    if (this.defaultValue >= 1) {
     this.getUserId().subscribe(()=>{
      this.getProductId().subscribe(productId=>{
        // body içindeki quantity değerini güncelle
        body.quantity = this.defaultValue;
        this.userService.addCart(this.userId , productId , body).subscribe(
          (response: any) => {
            if (response) {
              // HTTP durum kodu kontrolü
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Ürün sepete eklendi',
              });
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else {
              // HTTP durum kodu başarısızsa hata mesajı göster
              this.messageService.add({
                severity: 'error',
                summary: 'Başarısız',
                detail: 'Ürün sepete eklenemedi',
              });
            }
          },
          (error) => {
            // Hata durumunda mesaj göster
            console.log(error)
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
    // defaultValue'yi sıfırla
    this.defaultValue = 0;
  }



  updateProductPrice(): void {
    this.productPrice = this.defaultValue * this.product?.priceStacked;
  }

  addToCartFavorites(){
   this.getUserId().subscribe(()=>{
    this.getProductId().subscribe(productId=>{
      this.userService.addFavorite(this.userId, productId, this.product).subscribe(()=>{
        this.messageService.add({
          severity:'success',
          summary:'Başarılı',
          detail:"Favorilere eklendi"
        });
        setTimeout(()=>{window.location.reload()},1500);
      });
    })
   })
  }
}
