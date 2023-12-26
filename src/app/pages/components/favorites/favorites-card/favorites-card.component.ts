import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-favorites-card',
  templateUrl: './favorites-card.component.html',
  styleUrls: ['./favorites-card.component.scss']
})
export class FavoritesCardComponent {
  @Input() product: any;
  @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteExFavorites = new EventEmitter<any>();
  @Input() isExFavorites: boolean = false;
  @Input() liked: boolean = false;

  getFileUrl(fileName: string): string {
    return `http://localhost:8080/files/${fileName}`;
  }

  deleteExFavorites(productId: string , product:any) {
    this.onDeleteExFavorites.emit(productId);
  }
}
