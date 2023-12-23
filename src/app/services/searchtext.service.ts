import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchtextService {

  private searchTextSubject = new BehaviorSubject<string>('');
  searchText$ = this.searchTextSubject.asObservable();

  setSearchText(searchText: string) {
    this.searchTextSubject.next(searchText);
  }
}
