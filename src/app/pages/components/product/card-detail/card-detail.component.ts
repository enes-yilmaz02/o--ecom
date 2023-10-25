import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent {
  productId: string;
  product: any;


  constructor(private route: ActivatedRoute, private productService: ProductsService,private cart:CartService) { }

  ngOnInit() {
    // ActivatedRoute'i kullanarak ürün kimliğini al
    this.route.params.subscribe(params => {
      this.productId = params['id']; // Bu, "id" parametresine karşılık gelir
      this.product = this.productService.getProductById(this.productId);
    });
  }
  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
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

  addToCart(product:Product){
    this.cart.addToCart(product);
  }
}
