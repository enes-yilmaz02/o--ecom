import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  showLoading = true;

  hasData = true;

  contentData: any;

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.loadData();
    // 5 saniye sonra "loading" şablonunu gizle
    setTimeout(() => {
      this.showLoading = false;
    }, 3000);

  }

  loadData() {
    this.productService.getProducts().subscribe(
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
        console.error('Veri yüklenirken hata oluştu', error);
        this.showLoading = false;

      }
    );
  }
}
