import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  layout: "grid" | "list" = "grid";
  product: any;
  searchText: string = ''; // Arama metni için bir değişken
  filteredProducts: Product[] = []; // Filtrelenmiş ürünleri saklamak için bir dizi
  defaultValue: any;
  constructor(private productService:ProductService,private cart:CartService) {

  }


  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getProducts().subscribe((data:any) => {
      this.product = data;
    });
  }

  getSeverity(product: any) {
      switch (product.selectedStatus) {
          case 'INSTOCK':
              return 'success';

          case 'LOWSTOCK':
              return 'warning';

          case 'OUTOFSTOCK':
              return 'danger';

          default:
              return null;
      }
  };

  filterProducts(): any[] {
    const search = this.searchText.toLowerCase();
    return this.product?.filter((product: any) => {
      const productNameIncludes = product.name.toLowerCase().includes(search);
      // Kontrol ekleniyor: Eğer product.category bir dize değilse, false döndür
      const categoryIncludes = typeof product.category === 'string' && product.category.toLowerCase().includes(search);
  
      return productNameIncludes || categoryIncludes ;
    });
  }
}
