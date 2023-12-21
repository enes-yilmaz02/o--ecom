import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { UserService } from 'src/app/services/user.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Renderer2 } from '@angular/core';
// import { dropdownAnimation } from './dropdown.animations';
@Component({
  selector: 'app-navbar-list',
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.scss'],
  //animations: [dropdownAnimation]
})
export class NavbarListComponent implements OnInit {
  stateOptions: any[] = [
    { label: '🇹🇷 TR', value: 'tr' },
    { label: '🇬🇧 EN', value: 'en' },
  ];

  selectedLanguage: string = 'tr';

  orderBadge: any;

  favoritesBadge: any;

  cartsBadge: any;

  userId: any;

  translatedStockStatus: string;

  isOpen = false;

  items: MenuItem[] | undefined;
  user:any;

  constructor(
    private transloco: TranslocoService,
    private userService: UserService,
    private badgeService: BadgeService,
    private stockStatusPipe: StockStatusPipe,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.getUserId().subscribe(userId => {
      this.userService.getOrders(userId).subscribe((orders: any) => {
        this.orderBadge = orders.length.toString();
      });
    });

    this.getUserId().subscribe(userId => {
      this.userService.getFavorites(userId).subscribe((favorites: any) => {
        this.favoritesBadge = favorites.length.toString();
      });
    });

    this.getUserId().subscribe(userId => {
      this.userService.getCarts(userId).subscribe((carts: any) => {
        this.cartsBadge = carts.length.toString();
      });
    });
    this.badgeService.orderBadge$.subscribe((count) => {
      this.orderBadge = count.toString();
    });

    this.badgeService.favoritesBadge$.subscribe((count) => {
      this.favoritesBadge = count.toString();
    });

    this.badgeService.cartsBadge$.subscribe((count) => {
      this.cartsBadge = count.toString();
    });

    this.badgeService.cartUpdated$.subscribe(() => {
      // Diğer badge'leri güncelle
      this.updateBadges();
    });

    this.renderer.listen('document', 'click', (event: any) => {
      this.onDocumentClick(event);
    });

    this.getUserId().subscribe(()=>{
      this.getUser();
    });
  }

  private updateBadges() {
    // Sipariş, favoriler ve sepet badge'lerini güncelle
    this.getUserId().subscribe((userId) => {
      this.userService.getOrders(userId).subscribe((orders: any) => {
        this.orderBadge = orders.length.toString();
      });

      this.userService.getFavorites(userId).subscribe((favorites: any) => {
        this.favoritesBadge = favorites.length.toString();
      });

      this.userService.getCarts(userId).subscribe((carts: any) => {
        this.cartsBadge = carts.length.toString();
      });
    });
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  getUser(){
    this.userService.getUser(this.userId).subscribe((data)=>{
      this.user= data;
      console.log(this.user)
    })
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onDocumentClick(event: any) {
    const dropdownContainer = document.querySelector('.dropdown-container');

    if (!dropdownContainer.contains(event.target) ) {
      this.isOpen = false;
    }
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  setLanguage() {
    if (this.selectedLanguage === 'tr') {
      this.transloco.setActiveLang('tr');
    }
    if (this.selectedLanguage === 'en') {
      this.transloco.setActiveLang('en');
    }
  }

  updateStockStatusTranslation(stockstatus: any) {
    this.translatedStockStatus = this.stockStatusPipe.transform(stockstatus);
  }
}
