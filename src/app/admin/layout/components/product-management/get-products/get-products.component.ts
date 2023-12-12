import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-get-products',
  templateUrl: './get-products.component.html',
  styleUrls: ['./get-products.component.scss'],
})
export class GetProductsComponent {
  categoryForm: FormGroup;

  products!: any;

  userId: any;

  buyUserData: any;

  categories: any[] = [];

  status: any[] = [];

  priceCategories: any[] = [];

  rating: any[] = [];

  selectedCategory: any;

  selectedStatus: any;

  selectedPrice: any;

  selectedRating: any;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private userService: UserService,
    private translocoService: TranslocoService,
    private formBuilder: FormBuilder
  ) {
    this.getAllProducts();
    this.getCreoterBuyUsers();

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
    ];

    this.priceCategories = [
      { name: '0-100$', range: '0-100' },
      { name: '101-200$', range: '101-200' },
      { name: '201-300$', range: '201-300' },
      { name: '301-500$', range: '301-500' },
      { name: '501-1000$', range: '501-1000' },
      { name: '1000$ +', range: '1001-100000' },
    ];

    this.rating=[
      { name: '1' , value:1},
      { name: '2' , value:2},
      { name: '3' , value:3},
      { name: '4' , value:4},
      { name: '5' , value:5}
    ]

    this.categoryForm = this.formBuilder.group({
      category: ['', Validators.required],
      status: ['', Validators.required],
      price: ['', Validators.required],
      rating:['',Validators.required]
    });
  }


  getAllProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  onCategoryChange() {
    this.selectedCategory = this.categoryForm.get('category')?.value;
    if (this.selectedCategory.name === 'All Products') {
      this.getAllProducts();
    } else {
      this.getProductByFilter(this.selectedCategory.name);
    }
  }

  onPriceChange() {
    this.selectedPrice = this.categoryForm.get('price')?.value;
    const range = this.selectedPrice.range;

    if (range) {
      this.getProductByPrice(range);
    }
  }

  onStatusChange() {
    this.selectedStatus = this.categoryForm.get('status')?.value;
    const status = this.selectedStatus.name;

    if (status) {
      this.getProductByStatus(status);
    }
  }

  onRatingChange() {
    this.selectedRating = this.categoryForm.get('rating')?.value;
    const rating = this.selectedRating.value;

    if (rating) {
      this.getProductByRating(rating);
    }
  }

  deleteProduct(product: any) {
    this.productService.deleteProduct(product.id).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translocoService.translate('successMessage'),
          detail: this.translocoService.translate(
            'aGetProduct.messageDetailsuccess'
          ),
        });
        this.getAllProducts(); // Tabloyu güncelle
      },
      (error) => {
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: this.translocoService.translate('errorMessage'),
          detail: this.translocoService.translate(
            'aGetProduct.messageDetailsuccess'
          ),
        });
      }
    );
  }

  getCreoterBuyUsers() {
    this.productService.getAllCreoterOrders().subscribe((data: any) => {
      this.userId = data[0].userId;
      this.userService.getUser(this.userId).subscribe((data: any) => {
        this.buyUserData = data;
      });
    });
  }

  getFileUrl(fileName: string): string {
    // Update the URL template based on your file structure in Google Cloud Storage
    return `http://localhost:8080/files/${fileName}`;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
    }
  }

  getProductByFilter(category: any) {
    this.productService.getProductsByFilter(category).subscribe((data: any) => {
      this.products = data;
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
