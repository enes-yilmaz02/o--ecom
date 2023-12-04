import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
})
export class CartsComponent implements OnInit {

 contentData: any;

  product: any;

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any ; //Tokenden gelen user için tanımlı değişken

  showLoading = true;

  hasData = true;

  




  constructor(
    private userService:UserService,
    private messageService:MessageService
  ) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getUserId().subscribe(() => {
      this.getCarts();
    });
  }



  loadPageBasedOnContentData() {
    // Burada contentData değiştiğinde yapılacak işlemleri ekleyebilirsiniz.
    // Örneğin, değişikliğe göre bir sayfa yüklemesi yapabilirsiniz.
    console.log('contentData değişti. Sayfa yükleniyor...');
  }

  ngOnInit() {
    this.loadData();
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);
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
      this.product = data ;
    })
  }

  loadData() {
    this.getUserId().subscribe(()=>{
     this.userService.getCarts(this.userId).subscribe(
       (data :any) => {
         this.contentData = data;
         if(data != null && data.length>0){
           this.hasData = true;
         }else{
           this.hasData = false;
         }

         this.showLoading = false;

       },
       (error) => {
         console.error(error);
         this.showLoading = false;

       }
     );
    })
   }

     // Tüm siparişler silindiğinde bu fonksiyon çalışacak
  handleAllCartsDeleted() {
    this.showLoading=true;
    setTimeout(() => {
      this.hasData=false;
      this.showLoading = false;
    }, 3000);
  }

}
