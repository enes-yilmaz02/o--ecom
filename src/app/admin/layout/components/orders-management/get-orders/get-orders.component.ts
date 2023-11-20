import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-get-orders',
  templateUrl: './get-orders.component.html',
  styleUrls: ['./get-orders.component.scss']
})
export class GetOrdersComponent {

  orders:any;

  userData:any;

  constructor(private productService:ProductService,private userService:UserService){
    this.getAllCreoterOrders();
  }

  getAllCreoterOrders() {
    this.productService.getAllCreoterOrders().subscribe((data: any) => {
      this.orders = data;
      const userId=this.orders[0]['userId'];
      this.userService.getUser(userId).subscribe((userData:any)=>{
        this.userData=userData;
      })
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
