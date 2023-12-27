import { HttpClient } from '@angular/common/http';
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
  private uploadApi = 'http://localhost:8080/upload';
  @Input() id: any;
  updateProductForm: FormGroup;
  categorys: any;
  items: any;
  selecteProducts: any;
  selectedStatus: any;
  getFile: any;
  inventoryStatus: any;
  selectedFile: File | null = null;


  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private http: HttpClient,
  ) {
    this.updateProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      file:[''],
      priceStacked: ['', Validators.required],
      quantity: ['', Validators.required],
      selectedStatus: [''],
      valueRating: ['', Validators.required],
    });
  }

  ngOnInit(): void {

    this.loadData();

    this.categorys = [
      { name: 'Electronics' },
      { name: 'Fitness' },
      { name: 'Accessories' },
      { name: 'Clothing' },
    ];

    this.items = [
      { value: '1' },
      { value: '2' },
      { value: '3' },
      { value: '4' },
      { value: '5' },
    ];

    this.inventoryStatus = [
      { name: 'INSTOCK' },
      { name: 'LOWSTOCK' },
      { name: 'OUTOFSTOCK' },
    ];
  }

  loadData(){
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
            getFile: this.selecteProducts.file,
            quantity: this.selecteProducts.quantity,
            selectedStatus: this.selecteProducts.selectedStatus.name,
            valueRating: this.selecteProducts.valueRating,
          });
          this.getFile = this.selecteProducts.file;
        });
    });
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    event.preventDefault();
  }

  onUpload(file: any) {
    if (file) {
      const formData = new FormData();
      formData.append('filename', file);

      this.http.post(this.uploadApi, formData).subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.warn('Dosya seçilmedi');
    }
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
        console.error(
          'statu hatası'
        );
        return;
      }

      const body = {
        name: formValues.name,
        category: formValues.category,
        code: formValues.code,
        description: formValues.description,
        priceStacked: formValues.priceStacked,
        file: this.selectedFile?.name && this.getFile,
        quantity: formValues.quantity,
        valueRating: formValues.valueRating,
        selectedStatus: this.selectedStatus,
      };

      this.productService.updateProduct(this.id, body).subscribe(
        () => {
          this.onUpload(this.selectedFile);
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate(
              'dUpdateProduct.messageDetailsuccess'
            ),
          });
          this.loadData();
        },
        (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('errorMessage'),
            detail: this.translocoService.translate(
              'dUpdateProduct.messageDetailerror'
            ),
          });
        }
      );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translocoService.translate('warnMessage'),
        detail: this.translocoService.translate(
          'dUpdateProduct.messageDetailwarn'
        ),
      });
    }
  }
}
