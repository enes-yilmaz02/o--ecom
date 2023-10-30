import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  layout: "grid" | "list" = "grid";
  products!: Product[];
  searchText: string = ''; // Arama metni için bir değişken
  filteredProducts: Product[] = []; // Filtrelenmiş ürünleri saklamak için bir dizi
  constructor(private productService: ProductsService) {

  }


  ngOnInit() {
    this.productService.getProducts().then((data) => {
      this.products = data.slice(0, 12);
      // Sayfa yüklendiğinde tüm ürünleri filtrelenmiş ürünler listesine kopyala
      this.filteredProducts = [...this.products];
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
  };

  // Arama metnine göre ürünleri filtrelemek için bu yöntemi kullanabilirsiniz
  filterProducts(): any[] {
    const search = this.searchText.toLowerCase();
    return this.products?.filter((product) =>
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search)
    );
  }
}
