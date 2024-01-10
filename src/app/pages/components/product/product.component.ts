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
      }
    );
  }
}
