import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-carts',
  templateUrl: './carts.component.html',
  styleUrls: ['./carts.component.scss'],
})
export class CartsComponent implements OnInit {

  totalPrice: number;

  product: any;

  quantityOptions: SelectItem[] = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
  ];

  dataAvailable: boolean = false; // Veri var mı yok mu kontrolü

  userId: any ; //Tokenden gelen user için tanımlı değişken

  showLoading = true;

  hasData = true;

  contentData: any;




  constructor(
    private messageService: MessageService,
    private userService:UserService
  ) {
    // Verileri alıp hesaplamaları burada yapabiliriz
    this.getUserId().subscribe(() => {
      this.getCarts();
    });
  }

  ngOnInit() {
    this.loadData();
    // 5 saniye sonra "loading" şablonunu gizle
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

}
