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
  allProducts: any[] = [];
  revenue: any;
  products: any;
  orders: any;
  chartDataStatus: { labels: any[]; datasets: { label: any; data: number[]; fill: boolean; backgroundColor: string; borderColor: string; tension: number; }[]; };
  creoterData: any;

  constructor(
    private userService: UserService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.getUsersCount();
    this.getOrdersCount();
    this.getProductsCount();
    this.getAllCreoterOrders();
    this.updateChartDataStatus();

  }

  getUsersCount() {
    this.userService.getUsers().subscribe((data: any) => {
      this.usersCount = data.length;

      const roleCountMap = new Map();

      data.forEach(user => {
        const role = user.role;
        roleCountMap.set(role, (roleCountMap.get(role) || 0) + 1);
      });
      const creoterCount = roleCountMap.get("CREOTER") || 0;
      const userCount = roleCountMap.get("USER") || 0;
      const adminCount=roleCountMap.get('ADMİN') || 0;
      const documentStyle = getComputedStyle(document.documentElement);
      const roleArray=['Admin', 'Creoter', 'User'];

      this.chartData = {
        labels:roleArray ,
        datasets: [
          {
            label: 'Rol Durum',
            data: [adminCount,creoterCount, userCount],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('white'),
            borderColor: documentStyle.getPropertyValue('white'),
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
    });
  }

  getProductsCount() {
    this.productService.getProducts().subscribe(async (data:any) => {
      this.allProducts=data;
      this.updateChartDataStatus();
      this.productsCount = data.length;
      const roleCountMap = new Map();

      data.forEach(product => {
        const categoryCount =product.category ;
        roleCountMap.set(categoryCount, (roleCountMap.get(categoryCount) || 0) + 1);
      });

      const eltCount = roleCountMap.get("Electronics") || 0;
      const cloCount = roleCountMap.get("Clothing") || 0;
      const acsCount = roleCountMap.get('Accessories') || 0;
      const fitCount = roleCountMap.get('Fitness') || 0;

       const documentStyle = getComputedStyle(document.documentElement);
      const categoryArray=['Electronics', 'Clothing', 'Accessories','Fitness'];
       // chartData'yı güncelle
       this.chartDataProduct = {
         labels: categoryArray,
         datasets: [
           {
             label: 'Kategori ',
             data: [eltCount,cloCount, acsCount, fitCount],
             fill: false,
             backgroundColor: documentStyle.getPropertyValue('white'),
             borderColor: documentStyle.getPropertyValue('white'),
             tension: 0.4,
           },
         ],
       };
    });
  }


  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }


  getAllCreoterOrders() {
    this.products = []; // products dizisini başlat

    this.productService.getAllCreoterOrders().subscribe(
      (data: any) => {
        // Eğer herhangi bir sipariş bulunamazsa, this.orders'u boş bir diziyle güncelle
        this.orders = data || [];

        // Siparişler içinde dönerek ürünleri işle
        this.orders.forEach((item: any) => {
          // Her bir siparişteki ürünleri products dizisine ekle
          item.orders.forEach((orderItem: any) => {
            const existingProduct = this.products.find(
              (product) => product.name === orderItem.product.name
            );

            if (existingProduct) {
              // Eğer ürün zaten listeye ekli ise, adetini arttır
              existingProduct.quantity += 1;
            } else {
              // Eğer ürün daha önce listeye eklenmemişse, yeni bir ürün olarak ekle
              this.products.push({
                name: orderItem.product.name,
                file: orderItem.product.file,
                quantity: 1, // İlk kez eklenen ürünün adeti 1'dir
              });
            }
          });
        });

        // Quantity'ye göre sıralama
        this.products.sort((a, b) => b.quantity - a.quantity);

        console.log(this.products);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  updateChartDataStatus() {

      let inStockCount = 0;
      let outOfStockCount = 0;
      let runningLowCount = 0;

      this.allProducts.forEach((product: any) => {
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
        'Stokta',
        'Tükendi',
        'Tükenmek Üzere',
      ];

      // Güncellenmiş verileri kullanarak chartDataStatus'u güncelle
      const documentStyle = getComputedStyle(document.documentElement);
      this.chartDataStatus = {
        labels: statusNameArray,
        datasets: [
          {
            label: 'Durum',
            data: [inStockCount, outOfStockCount, runningLowCount],
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('white'),
            borderColor: documentStyle.getPropertyValue('white'),
            tension: 0.4,
          },
        ],
      };

  }


}
