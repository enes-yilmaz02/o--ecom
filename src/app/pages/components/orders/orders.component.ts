import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  showLoading = true;

  hasData = true;

  contentData: any;

  constructor(private cart:CartService){}

  ngOnInit() {
    this.loadData();
    // 5 saniye sonra "loading" şablonunu gizle
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);

  }

   loadData() {
    this.cart.getItemsOrders().subscribe(
      (data : Product[]) => {
        this.contentData = data;
        if(data.length>0){
          this.hasData = true;
        }else{
          this.hasData = false;
        }

        this.showLoading = false;
        console.log(data.length)
      },
      (error) => {
        console.error('Veri yüklenirken hata oluştu', error);
        this.showLoading = false;

      }
    );
  }
}
