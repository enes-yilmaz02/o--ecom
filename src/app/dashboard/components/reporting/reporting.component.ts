import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, tap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss'],
})
export class ReportingComponent {
  chartData: any;
  chartDataProduct: any;
  chartOptions: any;
  usersCount: any;
  ordersCount: any;
  productsCount: any;
  revenue: any;
  creoterId: any;
  creoterData: any;
  averageRating: any;
  products: any[] = [];
  orders: any;

  chartDataProductStock: {
    labels: any[];
    datasets: {
      label: string;
      data: any[];
      fill: boolean;
      backgroundColor: string;
      borderColor: string;
      tension: number;
    }[];
  };

  chartDataStatus: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      backgroundColor: string;
      borderColor: string;
      tension: number;
    }[];
  };


  constructor(
    private userService: UserService,
    private productService: ProductService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.getOrdersCount();
    this.getProductsByCreoterId();
    this.getAllCreoterOrders();
  }

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.creoterId = id;
      })
    );
  }

  getOrdersCount() {
    this.getUserId().subscribe(() => {
      this.productService
        .getAllCreoterOrdersById(this.creoterId)
        .subscribe((data: any) => {
          this.ordersCount = data.length;
          const totalAmounts = data.map((order) => order.totalAmount);
          this.revenue = this.calculateTotalRevenue(totalAmounts);
        });
    });
  }

  calculateTotalRevenue(amounts: number[]): number {
    return amounts.reduce((total, amount) => total + amount, 0);
  }

  getProductsByCreoterId() {
    this.getUserId().subscribe((creoterId: any) => {
      this.productService
        .getCreoterProducts(creoterId)
        .subscribe((data: any) => {
          this.creoterData = data;
          this.productsCount = data.length;
          this.updateChartDataProduct();
          this.updateChartDataProductStock();
          this.updateChartDataStatus();
          this.updateChartDataRating();
        });
    });
  }

  updateChartDataRating() {
    if (this.creoterData && this.creoterData.length > 0) {
      const validProducts = this.creoterData.filter(
        (item) => item && item.valueRating !== ''
      );
      if (validProducts.length > 0) {
        const totalRating = validProducts.reduce(
          (total, item) => total + parseFloat(item.valueRating),
          0
        );
        this.averageRating = validProducts.length > 0 ? totalRating / validProducts.length : 0;
      } else {
        console.error('Geçerli ürün verisi bulunamadı.');
      }
    }
  }

  updateChartDataProduct() {
    if (this.creoterData && this.creoterData.length > 0) {
      const roleCountMap = new Map();
      this.creoterData.forEach((product: any) => {
        const categoryCount = product.category;
        roleCountMap.set(
          categoryCount,
          (roleCountMap.get(categoryCount) || 0) + 1
        );
      });
      const eltCount = roleCountMap.get('Electronics') || 0;
      const cloCount = roleCountMap.get('Clothing') || 0;
      const acsCount = roleCountMap.get('Accessories') || 0;
      const fitCount = roleCountMap.get('Fitness') || 0;


      const documentStyle = getComputedStyle(document.documentElement);
      const categoryNameArray = [
        this.translocoService.translate('Electronics'),
        this.translocoService.translate('Clothing'),
        this.translocoService.translate('Accessories'),
        this.translocoService.translate('Fitness'),
      ];


      this.chartDataProduct = {
        labels: categoryNameArray,
        datasets: [
          {
            label: this.translocoService.translate('categoryStatus'),
            data: [eltCount, cloCount, acsCount, fitCount],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
            borderColor: documentStyle.getPropertyValue('--bluegray-700'),
            tension: 0.4,
          },
        ],
      };
    }
  }

  updateChartDataProductStock() {
    if (this.creoterData && this.creoterData.length > 0) {
      const productNameArray = [];
      const stockQuantityArray = [];


      this.creoterData.forEach((product: any) => {
        const productName = product.name;
        const stockQuantity = product.quantity;


        productNameArray.push(productName);
        stockQuantityArray.push(stockQuantity);
      });

      const documentStyle = getComputedStyle(document.documentElement);
      this.chartDataProductStock = {
        labels: productNameArray,
        datasets: [
          {
            label: this.translocoService.translate('stockStatusTable'),
            data: stockQuantityArray,
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
            borderColor: documentStyle.getPropertyValue('--bluegray-700'),
            tension: 0.4,
          },
        ],
      };
    }
  }

  updateChartDataStatus() {
    if (this.creoterData && this.creoterData.length > 0) {
      let inStockCount = 0;
      let outOfStockCount = 0;
      let runningLowCount = 0;

      this.creoterData.forEach((product: any) => {
        const stockQuantity = product.quantity;

        if (stockQuantity > 0) {
          inStockCount++;
        } else {
          outOfStockCount++;
          if (stockQuantity <= 5) {
            runningLowCount++;
          }
        }
      });

      const statusNameArray = [
        this.translocoService.translate('InStock'),
        this.translocoService.translate('OutofStock'),
        this.translocoService.translate('LowStock'),
      ];
      const documentStyle = getComputedStyle(document.documentElement);
      this.chartDataStatus = {
        labels: statusNameArray,
        datasets: [
          {
            label: this.translocoService.translate('status'),
            data: [inStockCount, outOfStockCount, runningLowCount],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
            borderColor: documentStyle.getPropertyValue('--bluegray-700'),
            tension: 0.4,
          },
        ],
      };
    }
  }


  getAllCreoterOrders() {
    this.getUserId().subscribe((userId) => {
      this.productService
        .getAllCreoterOrdersById(userId)
        .subscribe((data: any) => {
          this.orders = data.map((item: any) => {
            item.orders.forEach((orderItem: any) => {
              const existingProduct = this.products.find(
                (product) => product.name === orderItem.product.name
              );

              if (existingProduct) {
                existingProduct.quantity += 1;
              } else {
                this.products.push({
                  name: orderItem.product.name,
                  file:orderItem.product.file,
                  quantity: orderItem.product.quantity,
                });
              }
            });
            this.products.sort((a, b) => b.quantity - a.quantity);
          });
        });
    });
  }




}
