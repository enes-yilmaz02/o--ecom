import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
// Import KeyValuePipe
import { KeyValuePipe } from '@angular/common';
@Component({
  selector: 'app-get-products',
  templateUrl: './get-products.component.html',
  styleUrls: ['./get-products.component.scss'],
})
export class GetProductsComponent {
  products!: any;

  clonedProduct: { [s: string]: any } = {};

  userId: any;

  buyUserData: any;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private userService: UserService,
  ) {
    this.getAllProducts();
    this.getCreoterBuyUsers();
  }

  getObjectProperties(obj: any): any[] {
    const allowedProperties = ['name','surname', 'bDate', 'email','username','address'];
    const result = [];

    for (const key of allowedProperties) {
      if (obj.hasOwnProperty(key)) {
        result.push({ key, value: obj[key] });
      }
    }

    return result;
  }

  getAllProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  onRowEditInit(product: any) {
    this.clonedProduct[product.id as string] = { ...product };
  }

  onRowEditSave(product: any) {
    this.productService.updateProduct(product.id, product).subscribe(
      () => {
        delete this.clonedProduct[product.id as string];
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User is updated',
        });
      },
      (error) => {
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user',
        });
      }
    );
  }

  onRowEditCancel(product: any, index: number) {
    this.products[index] = this.clonedProduct[product.id as string];
    delete this.clonedProduct[product.id as string];
  }

  deleteProduct(product: any) {
    this.productService.deleteProduct(product.id).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User is updated',
        });
        this.getAllProducts(); // Tabloyu güncelle
      },
      (error) => {
        console.error('Error updating user:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user',
        });
      }
    );
  }

  getCreoterBuyUsers() {
    this.productService.getAllCreoterOrders().subscribe((data: any) => {
      this.userId = data[0].userId;
      this.userService.getUser(this.userId).subscribe((data: any) => {
        this.buyUserData = data;
        console.log(this.buyUserData);
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
}
