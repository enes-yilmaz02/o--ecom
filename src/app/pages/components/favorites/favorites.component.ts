import { Component } from '@angular/core';
import { Observable, forkJoin, tap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  showLoading = true;
  hasData = true;
  contentData: any;
  userId: any;
  hasExData: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadData();
    setTimeout(() => {
      this.showLoading = false;
    }, 1000);
  }

  getUserId(): Observable<any> {
    return this.userService.getTokenId().pipe(
      tap((id: any) => {
        this.userId = id;
      })
    );
  }

  /**
   * Kullanıcının favori ve ex-favori ürünlerini çeken ve component'in kullanımına sunan fonksiyon.
   * 1. `getUserId()` ile kullanıcının kimliği alınır.
   * 2. `getFavorites` ve `getExFavorites` fonksiyonları ile sırasıyla favori ve ex-favori ürünler asenkron olarak çekilir.
   * 3. `forkJoin` operatörü, her iki asenkron çağrının tamamlanmasını bekler ve gelen verileri tek bir dizi içinde birleştirir.
   * 4. Gelen veriler üzerinde kontrol yapılır ve uygun şekilde `contentData` ve `hasData` değişkenleri güncellenir.
   * 5. `showLoading` değişkeni false olarak ayarlanır, çünkü veriler başarıyla çekildi ve işlemler tamamlandı.
   */
  loadData() {
    this.getUserId().subscribe(() => {
      // Kullanıcının favori ürünlerini çeken observable
      const favorites$ = this.userService.getFavorites(this.userId);

      // Kullanıcının ex-favori ürünlerini çeken observable
      const exFavorites$ = this.userService.getExFavorites(this.userId);

      forkJoin([favorites$, exFavorites$]).subscribe(
        ([favoritesData, exFavoritesData]) => {
          // Favoriler veya Ex-Favorilerden herhangi biri varsa veriyi ayarla
          this.contentData = favoritesData?.length > 0
            ? favoritesData
            : exFavoritesData?.length > 0
            ? exFavoritesData
            : [];

          // Her iki tür de favori verisi yoksa, hasData'yi false yap
          this.hasData = !!favoritesData?.length;

          // Ex-Favori verisi yoksa, hasExData'yi false yap
          this.hasExData = !!exFavoritesData?.length;

          this.showLoading = false;
        },
        (error) => {
          console.error(error);
          this.showLoading = false;
        }
      );
    });
  }



  handleAllFavoritesDeleted() {
    this.showLoading = true;
    this.loadData();
    setTimeout(() => {
      this.hasData = false;
      this.showLoading = false;
    }, 1000);
  }


  handleAllExFavoritesDeleted() {
    this.showLoading = true;
    this.loadData();
    setTimeout(() => {
      this.hasExData = false;
      this.showLoading = false;
    }, 1000);
  }
}
