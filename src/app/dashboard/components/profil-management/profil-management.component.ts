import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profil-management',
  templateUrl: './profil-management.component.html',
  styleUrls: ['./profil-management.component.scss']
})
export class ProfilManagementComponent implements OnInit {
  profilForm:FormGroup;
  userId: any;
  selectedUser: any;
  genders: any;
  selectedGender:any;
  products: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private translocoService: TranslocoService,
    private productService:ProductService

  ) {
    this.profilForm = this.formBuilder.group({
      name: [''],
      surname: [''],
      username: [''],
      companyName:[''],
      email: [''],
      bDate: [''],
      gender: [''],
      phone: [''],
      address: [''],
    });
    this.getTokenUser();
    this.genders = [
      { name: 'Male', code: 'm' },
      { name: 'Female', code: 'fm' },
      { name: 'Another', code: 'a' },
    ];

  }

  ngOnInit(): void {
    this.getAllProducts();
  }


  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getAllProducts() {
    this.getUserId().subscribe(() => {
      this.productService
        .getCreoterProducts(this.userId)
        .subscribe((data: any) => {
          this.products = data;
        });
    });
  }

  getTokenUser() {
    this.getUserId().subscribe(() => {
      this.userService
        .getUser(this.userId)
        .subscribe((userData: any) => {
          this.selectedUser = userData;
          this.profilForm.patchValue({
            name: this.selectedUser.name,
            surname: this.selectedUser.surname,
            username: this.selectedUser.username,
            email: this.selectedUser.email,
            companyName:this.selectedUser.companyName,
            gender: this.selectedUser.gender,
            phone: this.selectedUser.phone,
            address: this.selectedUser.address,
            password: this.selectedUser.password,
            confirmpassword: this.selectedUser.confirmpassword,
          });
          const selectedDate = new Date(this.selectedUser.bDate);
          this.profilForm.get('bDate').setValue(selectedDate);
        });
    });
  }

  updateAllProductsForUser() {
    if (this.products && this.products.length > 0) {
      const formValues= this.profilForm.value;
      this.products.forEach((product: any) => {
        const updatedProduct = {
          email:formValues.email,
          companyName:formValues.companyName
        };
        console.log(updatedProduct)
        this.productService.updateProduct(product.id, updatedProduct).subscribe(() => {
        });
      });
    }
  }

  updateUser() {
    if (this.profilForm.valid) {
      const formValues = this.profilForm.value;
      this.getUserId().subscribe(() => {
        this.userService.updateUser(this.userId, formValues).subscribe(() => {
          this.updateAllProductsForUser();
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('successMessage'),
            detail: this.translocoService.translate('userinfoForm.messageDetailsuccess'),
          });
        });
      });
    }
  }
}
