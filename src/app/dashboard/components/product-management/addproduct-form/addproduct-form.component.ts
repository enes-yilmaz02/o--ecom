import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
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

  ingredient!: string;

  categorys: Category[] | undefined;

  items: SelectItem[];

  inventoryStatus: any[] = [
    { name: 'Instock', key: 'IS' },
    { name: 'Lowstock', key: 'LS' },
    { name: 'Outstock', key: 'OS' },
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
    debugger
   const productData= this.addproductForm.value;
    if(this.addproductForm.valid){
      this.productService.addProduct(productData);
    }
  }
}
