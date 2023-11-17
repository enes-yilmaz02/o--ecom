import { Component } from '@angular/core';

@Component({
  selector: 'app-card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.scss']
})
export class CardElementComponent {

product: any;

filterByCategory(filter:string) {
  console.log('clicked')
  const search = filter.toLowerCase();
  return this.product?.filter((product) =>
    product.name.toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search)
  );
}


}

