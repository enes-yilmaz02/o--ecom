import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { DataView } from 'primeng/dataview';
import { SelectItem, MessageService } from 'primeng/api';
import { Observable, map, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { BadgeService } from 'src/app/services/badge.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { CategoryStatus } from 'src/app/services/helper/category-status.pipe';
import { TranslocoService } from '@ngneat/transloco';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers:[StockStatusPipe,CategoryStatus]
})
export class CardComponent implements OnInit {
  layout: 'grid' | 'list' = 'grid';
  products: any;
  searchText: string = ''; // Arama metni için bir değişken
  filteredProducts: Product[] = []; // Filtrelenmiş ürünleri saklamak için bir dizi
  defaultValue: any;
  sortOrder: number = 0;
  sortField: string = '';
  sortOptions: SelectItem[] = [];
  files: any[] = [];
  userId: any;
  liked: boolean = true;
  translatedStockStatus: any;
  productData:any;


  constructor(
    private productService: ProductService,
    private userService: UserService,
    private messageService:MessageService,
    private route : ActivatedRoute,
    private badgeService:BadgeService,
    private translocoService:TranslocoService
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' },
    ];
  }


  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  getAllProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  getProduct(productId: any): Observable<any> {
    return this.productService.patchProductById(productId);
  }


  getSeverity(product: any) {
    switch (product.selectedStatus.name) {
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

  filterProducts(): any[] {
    const search = this.searchText.toLowerCase();
    return this.products?.filter((product: any) => {
      const productNameIncludes = product.name.toLowerCase().includes(search);
      // Kontrol ekleniyor: Eğer product.category bir dize değilse, false döndür
      const categoryIncludes =
        typeof product.category === 'string' &&
        product.category.toLowerCase().includes(search);

      return productNameIncludes || categoryIncludes;
    });
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  isOutOfStock(product: any): boolean {
    return product.selectedStatus?.name === 'OUTOFSTOCK';
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }
  getProductId(): Observable<string> {
    return this.route.params.pipe(
      map(params => params['id'])
    );
  }

  getProductByFilter(category:any){
    this.productService.getProductsByFilter(category).subscribe((data:any)=>{
      this.products=data;
      console.log(data);
    })
  }


  addToCart(product: any, productId: any) {
    this.getUserId().subscribe(() => {
      const quantity: number = 1;
      const body = {
        id: productId,
        creoterId:product.creoterId,
        email:product.email,
        product: {
          ...product,
          quantity: quantity,
        },
      };
      console.log(body);
      this.userService.addCart(this.userId, productId, body).subscribe(
        (response: any) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('successMessage'),
              detail: this.translocoService.translate('cardDetail.messageDetailsuccessaddcart'),
            });
            this.badgeService.emitCartUpdatedEvent();
            this.getProduct(productId);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: this.translocoService.translate('errorMessage'),
              detail: this.translocoService.translate('cardDetail.messageDetailerroraddcart'),
            });
          }
        },
        (error) => {
          console.log(error);
        }

      );
    });

  }

}
