import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
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

  ingredient!: string;

  categorys: any;

  items: SelectItem[];

  inventoryStatus: any = [
    { name: 'INSTOCK', key: 'IS' },
    { name: 'LOWSTOCK', key: 'LS' },
    { name: 'OUTOFSTOCK', key: 'OS' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
  ) {
    this.addproductForm = this.formBuilder.group({
      code: ['', Validators.required], // Örnek: Validators ekleyerek girişin zorunlu olup olmadığını belirleyebilirsiniz
      name: ['', Validators.required],
      quantity: ['',Validators.required],
      priceStacked: ['',Validators.required],
      file: ['',Validators.required],
      category: ['', Validators.required],
      selectedStatus: ['',Validators.required],
      valueRating: ['',Validators.required],
      description: ['',Validators.required],
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
  }

  onSubmit() {
   const productData= this.addproductForm.value;
    if(this.addproductForm.valid){
      this.productService.addProduct(productData).subscribe(()=>{
      //   const formData = new FormData();
      //    formData.append('file', this.addproductForm.get('file').value);

      //    this.productService.post('API_URL/upload', formData).subscribe((response) => {
      //     console.log('Dosya yükleme başarılı', response);
      //   // Burada gelen dosya URL'sini kullanarak ürünü güncelleyebilirsiniz
      // });
        window.location.reload();
      });
    }

  }
}
