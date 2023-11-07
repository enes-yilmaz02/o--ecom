import { Component } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  showLoading = true;

  hasData = true;

  contentData: any;


  constructor(private cartService: CartService) {
  }

  ngOnInit() {
    this.loadData();
    // 5 saniye sonra "loading" şablonunu gizle
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);

  }

  loadData() {
    this.cartService.getItemsFavorites().subscribe(
      (data :any) => {
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
