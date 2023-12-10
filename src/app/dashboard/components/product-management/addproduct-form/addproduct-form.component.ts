import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService, SelectItem } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-addproduct-form',
  templateUrl: './addproduct-form.component.html',
  styleUrls: ['./addproduct-form.component.scss'],
})
export class AddproductFormComponent  {
  private uploadApi = 'http://localhost:8080/upload';

  addproductForm: FormGroup;

  ingredient!: string;

  categorys: any[] ;

  items: SelectItem[];

  selectedFile: File | null = null;

  userId: any;

  creoterData: any;

  createDate = new Date();

  inventoryStatus: any = [
    { name: 'INSTOCK', key: 'IS' },
    { name: 'LOWSTOCK', key: 'LS' },
    { name: 'OUTOFSTOCK', key: 'OS' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private productService: ProductService,
    private messageService: MessageService,
    private userService: UserService,
    private translocoService:TranslocoService
  ) {
    this.addproductForm = this.formBuilder.group({
      code: ['', Validators.required], // Örnek: Validators ekleyerek girişin zorunlu olup olmadığını belirleyebilirsiniz
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      priceStacked: ['', Validators.required],
      file: ['', Validators.required],
      category: ['', Validators.required],
      selectedStatus: ['', Validators.required],
      valueRating: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.items = [];
    for (let i = 1; i < 6; i++) {
      this.items.push({ label: ' ' + i, value: ' ' + i });
    }

    // this.categorys  = [
    //   { name: this.translocoService.translate('Electronics'), code: 'ELT' },
    //   { name: this.translocoService.translate('Fitness'), code: 'FT' },
    //   { name: this.translocoService.translate('Accessories'), code: 'ACS' },
    //   { name: this.translocoService.translate('Clothing'), code: 'CLT' },
    // ];

    this.categorys  = [
      { name: 'Electronics', code: 'ELT' },
      { name: 'Fitness', code: 'FT' },
      { name: 'Accessories', code: 'ACS' },
      { name: 'Clothing', code: 'CLT' },
    ];

  }



  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getCreoter() {
    this.getUserId().subscribe(() => {
      this.userService.getUser(this.userId).subscribe((data) => {
        this.creoterData = data;
      });
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
      console.warn('No file selected.');
    }
  }

  onSubmit() {
    this.getUserId().subscribe(() => {
      this.userService.getUser(this.userId).subscribe((data) => {
        const productData = this.addproductForm.value;
        if (this.addproductForm.valid) {
          productData.file = this.selectedFile.name;
          productData.creoterId = this.userId;
          productData.companyName = data.companyName;
          productData.email = data.email;
          productData.createDate = this.createDate;
          this.productService.addProduct(productData).subscribe(
            () => {
              this.onUpload(this.selectedFile);
              this.messageService.add({
                severity: 'success',
                summary: this.translocoService.translate('successMessage'),
                detail:  this.translocoService.translate('dAddProduct.messageDetailsuccess'),
              });
            },
            (error) => {
              this.messageService.add({
                severity: 'success',
                summary: this.translocoService.translate('errorMesagge'),
                detail: this.translocoService.translate('dAddProduct.messageDetailerror'),
              });
            }
          );
        }else{
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('warnMessage'),
            detail:  this.translocoService.translate('dAddProduct.messageDetailwarn'),
          });
        }
      });
    });
  }
}
