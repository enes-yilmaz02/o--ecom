import { MessageService } from 'primeng/api';
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


  constructor(private cartService: CartService , private messageService:MessageService) {
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

      },
      (error) => {
        this.messageService.add({severity:'error', summary:'Error', detail:"Could not fetch favorites."});
        this.showLoading = false;

      }
    );
  }
}
