import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-get-products',
  templateUrl: './get-products.component.html',
  styleUrls: ['./get-products.component.scss'],
})
export class GetProductsComponent {
  products!: any;

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



  getAllProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    });
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
