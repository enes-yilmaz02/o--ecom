import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss'],
})
export class UpdateProductComponent implements OnInit {
  @Input() id: any;

  updateProductForm: FormGroup;

  categorys: any;

  items: any;

  selecteProducts: any;

  file: any;

  inventoryStatus: any = [
    { name: 'INSTOCK', key: 'IS' },
    { name: 'LOWSTOCK', key: 'LS' },
    { name: 'OUTOFSTOCK', key: 'OS' },
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.updateProductForm = this.formBuilder.group({
      name: [''],
      code: [''],
      email: [''],
      category: [''],
      description: [''],
      companyName: [''],
      priceStacked: [''],
      quantity: [''],
      selectedStatus: [''],
      valueRating: [''],
      file: [''],
    });

    this.items = [];
    for (let i = 1; i < 6; i++) {
      this.items.push({ label: ' ' + i, value: ' ' + i });
    }
  }

  ngOnInit(): void {
    this.categorys = [
      { name: 'Electronics', code: 'ELT' },
      { name: 'Fitness', code: 'FT' },
      { name: 'Accessories', code: 'ACS' },
      { name: 'Clothing', code: 'CLT' },
    ];
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.productService
        .patchProductById(this.id)
        .subscribe((productData: any) => {
          this.selecteProducts = productData;
          console.log('Selected Status:', this.selecteProducts.selectedStatus);
          this.updateProductForm.patchValue({
            name: this.selecteProducts.name,
            category: this.selecteProducts.category,
            code: this.selecteProducts.code,
            description: this.selecteProducts.description,
            priceStacked: this.selecteProducts.priceStacked,
            file: this.selecteProducts.file,
            quantity: this.selecteProducts.quantity,
            selectedStatus: this.selecteProducts.selectedStatus.name,
            valueRating: this.selecteProducts.valueRating,
          });
          // File değerini de güncelle
          this.file = this.selecteProducts.file;
        });
    });
  }

  getFileUrl(fileName: string): string {
    // Update the URL template based on your file structure in Google Cloud Storage
    return `http://localhost:8080/files/${fileName}`;
  }
}
