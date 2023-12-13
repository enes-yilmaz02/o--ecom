import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
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

  selectedStatus:any;

  file: any;

  inventoryStatus: any = [
    { name: 'INSTOCK', key: 'IS' },
    { name: 'LOWSTOCK', key: 'LS' },
    { name: 'OUTOFSTOCK', key: 'OS' },
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private messageService:MessageService,
    private translocoService:TranslocoService
  ) {
    this.updateProductForm = this.formBuilder.group({
      name: ['' , Validators.required],
      code: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      priceStacked: ['', Validators.required],
      quantity: ['', Validators.required],
      selectedStatus: [''],
      valueRating: ['', Validators.required],
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
          this.file = this.selecteProducts.file;
        });
    });
  }

  getFileUrl(fileName: string): string {
    // Update the URL template based on your file structure in Google Cloud Storage
    return `http://localhost:8080/files/${fileName}`;
  }

  updateProduct() {
    if (this.updateProductForm.valid) {
      const formValues = this.updateProductForm.value;
      const updatedQuantity = formValues.quantity;


      if (updatedQuantity < 20 && updatedQuantity > 1) {
        this.selectedStatus = { name: 'LOWSTOCK', key: 'LS' };
      } else if (updatedQuantity >= 20) {
        this.selectedStatus = { name: 'INSTOCK', key: 'IS' };
      } else if (updatedQuantity < 1) {
        this.selectedStatus = { name: 'OUTOFSTOCK', key: 'OS' };
      }

      if (!this.selectedStatus) {
        console.error('Selected status is undefined. Check the conditions for updating.');
        return;
      }

      const body = {
        name: formValues.name,
        category: formValues.category,
        code: formValues.code,
        description: formValues.description,
        priceStacked: formValues.priceStacked,
        file: formValues.file,
        quantity: formValues.quantity,
        valueRating: formValues.valueRating,
        selectedStatus: this.selectedStatus
      };

      this.productService.updateProduct(this.id, body).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate('dUpdateProduct.messageDetailsuccess')
          });
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail: this.translocoService.translate('dUpdateProduct.messageDetailerror')
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate('dUpdateProduct.messageDetailwarn')
      });
    }
  }

}
