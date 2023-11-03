import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
interface Rating {
  name: string;
  code: string;
}
interface Category {
  name: string;
  code: string;
}

@Component({
  selector: 'app-addproduct-form',
  templateUrl: './addproduct-form.component.html',
  styleUrls: ['./addproduct-form.component.scss'],
})
export class AddproductFormComponent implements OnInit {
  addproductForm: FormGroup;

  valueRating: Rating[];

  uploadedFiles: any[] = [];

  uploadedFile: File[]; // Bu değişkeni bileşen düzeyinde tanımlayın.

  ingredient!: string;

  categorys: Category[] | undefined;

  items: SelectItem[];

  idvalue: string;

  inventoryStatus: any[] = [
    { name: 'Instock', key: 'IS' },
    { name: 'Lowstock', key: 'LS' },
    { name: 'Outstock', key: 'OS' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService
  ) {
    this.addproductForm = this.formBuilder.group({
      code: ['', Validators.required], // Örnek: Validators ekleyerek girişin zorunlu olup olmadığını belirleyebilirsiniz
      name: ['', Validators.required],
      quantity: [''],
      priceStacked: [''],
      file: [''],
      category: ['', Validators.required],
      selectedStatus: [''],
      valueRating: [''],
      description: [''],
    });

    this.items = [];
    for (let i = 1; i < 6; i++) {
      this.items.push({ label: ' ' + i, value: ' ' + i });
    }

    // localStorage'dan id değerini al veya "1" ile başlat
    this.idvalue = localStorage.getItem('idvalue') || '1';
    localStorage.setItem('idvalue', this.idvalue); // ID değerini string olarak kaydet

  }
  ngOnInit(): void {
    this.categorys = [
      { name: 'Electronics', code: 'ELT' },
      { name: 'Fitness', code: 'FT' },
      { name: 'Accessories', code: 'ACS' },
      { name: 'Clothing', code: 'CLT' },
    ];
  }

  onSubmit() {
    const idvalue = this.idvalue + 1;
    const codeValue = this.addproductForm.get('code').value;
    const nameValue = this.addproductForm.get('name').value;
    const quantityValue = this.addproductForm.get('quantity').value;
    const priceStackedValue = this.addproductForm.get('priceStacked').value;
    const fileValue = this.addproductForm.get('file').value;
    const categoryValue = this.addproductForm.get('category').value;
    const selectedStatusValue = this.addproductForm.get('selectedStatus').value;
    const valueRatingValue = this.addproductForm.get('valueRating').value;
    const descriptionValue = this.addproductForm.get('description').value;

    const productData = {
      id: idvalue,
      code: codeValue,
      name: nameValue,
      file: fileValue, // Yüklendiğinde alınan URL'i ekleyin
      priceStacked: priceStackedValue,
      quantity: quantityValue,
      selectedStatus: selectedStatusValue,
      category: categoryValue,
      valueRating: valueRatingValue,
      descriptionValue: descriptionValue,
    };
    this.productService.addProduct(productData).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Başarılı',
        detail: 'Ürün yükleme işlemi başarılı',
      });
    });
    this.idvalue = idvalue;
    // localStorage'da idvalue'yu güncelleyin
    localStorage.setItem('idvalue', this.idvalue.toString());
  }
}
