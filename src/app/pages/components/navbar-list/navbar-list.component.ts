import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

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

  selectedLanguage: string = 'tr';

  orderBadge: any;

  favoritesBadge: any;

  cartsBadge: any;

  userId : any;

  constructor(
    private transloco: TranslocoService,
    private userService: UserService
      ) {}

      ngOnInit(): void {
        this.getUserId().subscribe(userId => {
          this.userService.getOrders(userId).subscribe((orders:any) => {
            this.orderBadge = orders.length.toString();
          });
        });

        this.getUserId().subscribe(userId => {
          this.userService.getFavorites(userId).subscribe((favorites:any) => {
            this.favoritesBadge = favorites.length.toString();
          });
        });

        this.getUserId().subscribe(userId => {
          this.userService.getCarts(userId).subscribe((carts:any) => {
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

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  setLanguage() {
    if (this.selectedLanguage === 'tr') {
      this.transloco.setActiveLang('tr');
    }
    if (this.selectedLanguage === 'en') {
      this.transloco.setActiveLang('en');
    }
  }
}
