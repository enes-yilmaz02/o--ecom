import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-get-product',
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.scss'],
})
export class GetProductComponent {
  categoryForm: FormGroup;
  creoterId: any;
  products: any;
  isUserDialogOpen: boolean = false;
  selectedCategory: any;
  selectedPrice: any;
  selectedStatus: any;
  selectedRating: any;
  companyNames: any;
  priceCategories: { name: string; range: string }[];
  rating: { name: string; value: number }[];
  status: { name: string; code: string }[];
  categories: { name: string; code: string }[];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private formBuilder: FormBuilder
  ) {
    this.getAllProducts();

    this.categories = [
      { name: 'All Products', code: 'allProducts' },
      { name: 'Accessories', code: 'acc' },
      { name: 'Electronics', code: 'elt' },
      { name: 'Clothing', code: 'clt' },
      { name: 'Fitness', code: 'fts' },
    ];

    this.status = [
      { name: 'INSTOCK', code: 'IS' },
      { name: 'OUTOFSTOCK', code: 'OS' },
      { name: 'LOWSTOCK', code: 'LS' },
      { name: 'All', code: 'All' },
    ];

    this.priceCategories = [
      { name: '0-100$', range: '0-100' },
      { name: '101-200$', range: '101-200' },
      { name: '201-300$', range: '201-300' },
      { name: '301-500$', range: '301-500' },
      { name: '501-1000$', range: '501-1000' },
      { name: '1000$ +', range: '1001-100000' },
      { name: 'All', range: '0-100000' },
    ];

    this.rating = [
      { name: '1', value: 1 },
      { name: '2', value: 2 },
      { name: '3', value: 3 },
      { name: '4', value: 4 },
      { name: '5', value: 5 },
      { name: 'All', value: 6 },
    ];

    this.categoryForm = this.formBuilder.group({
      category: ['', Validators.required],
      status: ['', Validators.required],
      price: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllProducts();
  }

  onCategoryChange() {
    this.selectedCategory = this.categoryForm.get('category')?.value;
    if (this.selectedCategory === 'All Products') {
      this.getAllProducts();
    } else {
      this.getProductByFilter(this.selectedCategory);
    }
  }

  onPriceChange() {
    this.selectedPrice = this.categoryForm.get('price')?.value;
    const range = this.selectedPrice;

    if (range) {
      this.getProductByPrice(range);
    }
  }

  onStatusChange() {
    this.selectedStatus = this.categoryForm.get('status')?.value;
    const status = this.selectedStatus;

    if (status) {
      this.getProductByStatus(status);
    }
  }

  onRatingChange() {
    this.selectedRating = this.categoryForm.get('rating')?.value;
    const rating = this.selectedRating;

    if (rating) {
      this.getProductByRating(rating);
    }
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.creoterId = id;
      })
    );
  }

  getAllProducts() {
    this.getUserId().subscribe(() => {
      this.productService
        .getCreoterProducts(this.creoterId)
        .subscribe((data: any) => {
          this.products = data;
          this.companyNames = this.products.map(
            (product: any) => product.companyName
          );
        });
    });
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  deleteProduct(productId: any) {
    this.getUserId().subscribe((userId: any) => {
      this.productService
        .deleteCreoterProduct(userId, productId)
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate(
              'dGetProduct.messageDetailsuccess'
            ),
          });
        });
    });
    this.getAllProducts();
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status) {
    switch (status) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warning';

      case 'OUTOFSTOCK':
        return 'danger';

      case ' ':
        return null;
    }
  }

  getProductByFilter(category: any) {
    this.productService.getProductsByFilter(category).subscribe((data: any) => {
      this.products = data;
      console.log(data);
    });
  }

  getProductByPrice(range: any) {
    this.productService.getProductsByPrice(range).subscribe((data: any) => {
      this.products = data;
    });
  }

  getProductByStatus(status: any) {
    this.productService.getProductsByStatus(status).subscribe((data: any) => {
      this.products = data;
    });
  }

  getProductByRating(rating: any) {
    this.productService.getProductsByRating(rating).subscribe((data: any) => {
      this.products = data;
    });
  }
}
