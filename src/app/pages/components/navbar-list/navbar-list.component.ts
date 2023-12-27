import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BadgeService } from 'src/app/services/badge.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Renderer2 } from '@angular/core';
import { OnChangeService } from 'src/app/services/onchange.service';
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

  selectedLanguage: string; // Seçilen dil
  orderBadge: any; // Sipariş batch bilgisi
  favoritesBadge: any; // Favori ürünler batch bilgisi
  cartsBadge: any; // Sepet batch bilgisi
  userId: any; // Kullanıcı ID'si
  translatedStockStatus: string; // Çevrilmiş stok durumu
  isOpen = false; // Dropdown menü durumu
  searchText: string = ''; // Arama metni
  items: MenuItem[] | undefined; // PrimeNG menü öğeleri
  user: any; // Kullanıcı bilgileri

  constructor(
    private userService: UserService,
    private badgeService: BadgeService,
    private router: Router,
    private renderer: Renderer2,
    private searchService: OnChangeService,
    private languageService: LanguageService
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

    // Dil değişikliklerini izle
    this.languageService.language$.subscribe((language:any) => {
      this.selectedLanguage = language;
    });
    // Sipariş batch bilgisini güncelle
    this.badgeService.orderBadge$.subscribe((count:any) => {
      this.orderBadge = count.toString();
    });
    // Favori ürünler batch bilgisini güncelle
    this.badgeService.favoritesBadge$.subscribe((count:any) => {
      this.favoritesBadge = count.toString();
    });
    // Sepet batch bilgisini güncelle
    this.badgeService.cartsBadge$.subscribe((count:any) => {
      this.cartsBadge = count.toString();
    });
    // Sepet güncellendiğinde batch bilgisini güncelle
    this.badgeService.cartUpdated$.subscribe(() => {
      this.updateBadges();
    });
    // Dış tıklamalarda dropdown'ı kapat
    this.renderer.listen('document', 'click', (event: any) => {
      this.onDocumentClick(event);
    });
    // Kullanıcı ID'sini al ve kullanıcı bilgilerini getir
    this.getUserId().subscribe(() => {
      this.getUser();
    });
  }

  // Batch bilgilerini güncelle
  private updateBadges() {
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

  getUser() {
    this.userService.getUser(this.userId).subscribe((data) => {
      this.user = data;
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onDocumentClick(event: any) {
    const dropdownContainer = document.querySelector('.dropdown-container');

    if (!dropdownContainer?.contains(event.target)) {
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
}
