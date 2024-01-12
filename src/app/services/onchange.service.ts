import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnChangeService {

  private searchTextSubject = new BehaviorSubject<string>('');
  private updateSubject = new Subject<any>();
  private exFavoritesUpdatedSubject = new Subject<void>();

  update$ = this.updateSubject.asObservable();
  searchText$ = this.searchTextSubject.asObservable();
  exFavoritesUpdated$ = this.exFavoritesUpdatedSubject.asObservable();

  setSearchText(searchText: string) {
    this.searchTextSubject.next(searchText);
  }

  // notifyUpdate(value: any) {
  //   this.updateSubject.next(value);
  // }

  changeExFavorites() {
    this.exFavoritesUpdatedSubject.next();
  }
}
