import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { UserService } from 'src/app/services/user.service';
import { StockStatusPipe } from 'src/app/services/helper/stock-status.pipe';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Renderer2 } from '@angular/core';
import { OnChangeService } from 'src/app/services/on-change.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-navbar-list',
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.scss'],
})
export class NavbarListComponent implements OnInit {
  stateOptions: any[] = [
    { label: '🇹🇷 TR', value: 'tr' },
    { label: '🇬🇧 EN', value: 'en' },
  ];
  selectedLanguage: string;
  orderBadge: any;
  favoritesBadge: any;
  cartsBadge: any;
  userId: any;
  translatedStockStatus: string;
  isOpen = false;
  searchText : string ='';
  items: MenuItem[] | undefined;
  user:any;

  constructor(
    private transloco: TranslocoService,
    private userService: UserService,
    private badgeService: BadgeService,
    private stockStatusPipe: StockStatusPipe,
    private router: Router,
    private renderer: Renderer2,
    private searchService:OnChangeService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.getUserId().subscribe(userId => {
      this.userService.getOrders(userId).subscribe((orders: any) => {
        this.orderBadge = orders.length.toString();
      });

      this.languageService.language$.subscribe((language) => {
        this.selectedLanguage = language;
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

  onSearchInputChange() {
    this.searchService.setSearchText(this.searchText);
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
    this.languageService.setLanguage(this.selectedLanguage);
  }

  updateStockStatusTranslation(stockstatus: any) {
    this.translatedStockStatus = this.stockStatusPipe.transform(stockstatus);
  }
}
