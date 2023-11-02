import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
interface Rating {
  name: string;
  code: string;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-addproduct-form',
  templateUrl: './addproduct-form.component.html',
  styleUrls: ['./addproduct-form.component.scss'],
})
export class AddproductFormComponent {
  addproductForm: FormGroup;

  valueRating: Rating[];

  uploadedFiles: any[] = [];

  uploadedFile: File[]; // Bu değişkeni bileşen düzeyinde tanımlayın.

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService:ProductService
  ) {
    this.addproductForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      image: [],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      inventoryStatus: ['', Validators.required],
      category: ['', Validators.required],
      valueRating: ['', Validators.required],
    });

  }

  onBasicUploadAuto(event: UploadEvent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Auto Mode',
    });
    this.uploadedFile = event.files;
    // 'image' form alanına yüklenen dosyayı atayın
  this.addproductForm.get('image').setValue(event.files);
  }

  // onSubmit() {
  //   const fileToUpload = this.uploadedFile[0]; // İlk yüklenen dosyayı alın
  //   const targetPath = 'images/' + fileToUpload.name; // Hedef yolunu belirleyin

  //   this.productService.uploadFile(fileToUpload, targetPath)
  //     .then((downloadURL) => {
  //       // Dosyanın yüklendiği URL'i aldınız, bunu ürün eklemesi için kullanabilirsiniz
  //       const productData = {
  //         code: this.addproductForm.value.code,
  //         name: this.addproductForm.value.name,
  //         image: downloadURL, // Yüklendiğinde alınan URL'i ekleyin
  //         price: this.addproductForm.value.price,
  //         quantity: this.addproductForm.value.quantity,
  //         inventoryStatus: this.addproductForm.value.inventoryStatus,
  //         category: this.addproductForm.value.category,
  //         valueRating: this.addproductForm.value.valueRating,

  //         // Diğer alanlar...
  //       };

  //       this.productService.addProduct(productData).then(() => {
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Başarılı',
  //           detail: 'Ürün yükleme işlemi başarılı',
  //         });
  //       });
  //     })
  //     .catch((error) => {
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Hata',
  //         detail: 'Ürün yükleme işlemi başarısız: ' + error,
  //       });
  //     });
  // }

}
