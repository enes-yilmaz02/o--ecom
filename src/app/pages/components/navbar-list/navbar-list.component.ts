import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar-list',
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.scss']
})
export class NavbarListComponent implements OnInit {
  stateOptions: any[] = [{ label: '🇹🇷 TR', value: 'tr' }, { label: '🇬🇧 EN', value: 'en' }];
  selectedLanguage: string = 'tr';
  orderBadge: string;
  favoritesBadge: string;



  constructor( private transloco: TranslocoService,private cartService: CartService) {}


  ngOnInit(): void {
    this.cartService.orderBadge.subscribe((badge) => {
      this.orderBadge = badge.toString();
    });

    this.cartService.favoritesBadge.subscribe((badge) => {
      this.favoritesBadge = badge.toString();
    });
  }

setLanguage() {
  if(this.selectedLanguage=== 'tr'){
    this.transloco.setActiveLang('tr');
  }
  if(this.selectedLanguage=== 'en'){
    this.transloco.setActiveLang('en');
  }
}
}
