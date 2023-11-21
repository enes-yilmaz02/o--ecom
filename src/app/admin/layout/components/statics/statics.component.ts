import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss'],
})
export class StaticsComponent implements OnInit {
  chartData: any;

  chartDataProduct:any;

  chartOptions: any;

  usersCount: any;

  ordersCount: any;

  productsCount: any;

  revenue: any;

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getUsersCount();
    this.getOrdersCount();
    this.getProductsCount();

  }

  getUsersCount() {
    this.userService.getUsers().subscribe((data: any) => {
      this.usersCount = data.length;

      const roleCountMap = new Map();

      data.forEach(user => {
        const role = user.role;
        roleCountMap.set(role, (roleCountMap.get(role) || 0) + 1);
      });

      //ADMİN CREOTER ve USER sayıları
      const creoterCount = roleCountMap.get("CREOTER") || 0;
      const userCount = roleCountMap.get("USER") || 0;
      const adminCount=roleCountMap.get('ADMİN') || 0;

      // Diğer işlemleri yapabilirsiniz
      const documentStyle = getComputedStyle(document.documentElement);

      // chartData'yı güncelle
      this.chartData = {
        labels: ['Admin', 'Creoter', 'User'],
        datasets: [
          {
            label: 'First Dataset',
            data: [adminCount,creoterCount, userCount],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
            borderColor: documentStyle.getPropertyValue('--bluegray-700'),
            tension: 0.4,
          },
        ],
      };
    });
  }


  getOrdersCount() {
    this.productService.getAllCreoterOrders().subscribe((data) => {
      this.ordersCount = data.length;
      this.revenue = this.productService.calculateTotalRevenue(data);
      console.log(this.revenue);
    });
  }

  getProductsCount() {
    this.productService.getProducts().subscribe(async (data:any) => {
      this.productsCount = data.length;
      console.log(this.productsCount);
      console.log(data);
      const roleCountMap = new Map();

      data.forEach(product => {
        const categoryCount =product.category?.name ;
        roleCountMap.set(categoryCount, (roleCountMap.get(categoryCount) || 0) + 1);
      });

      const eltCount = roleCountMap.get("Electronics") || 0;
      const cloCount = roleCountMap.get("Clothing") || 0;
      const acsCount = roleCountMap.get('Accessories') || 0;
      const fitCount = roleCountMap.get('Fitness') || 0;

       // Diğer işlemleri yapabilirsiniz
       const documentStyle = getComputedStyle(document.documentElement);

       // chartData'yı güncelle
       this.chartDataProduct = {
         labels: ['Electronics', 'Clothing', 'Accessories','Fitness'],
         datasets: [
           {
             label: 'First Dataset',
             data: [eltCount,cloCount, acsCount, fitCount],
             fill: false,
             backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
             borderColor: documentStyle.getPropertyValue('--bluegray-700'),
             tension: 0.4,
           },
         ],
       };
    });
  }
}
