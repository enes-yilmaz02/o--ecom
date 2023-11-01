import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

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
  constructor(private productService:ProductService) {

  }


  ngOnInit() {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
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
