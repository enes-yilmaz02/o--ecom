import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject: BehaviorSubject<string>;
  public language$: Observable<string>;

  constructor(private transloco: TranslocoService) {
    this.languageSubject = new BehaviorSubject<string>('tr');
    this.language$ = this.languageSubject.asObservable();
  }

  setLanguage(language: string): void {
    this.transloco.setActiveLang(language);
    this.languageSubject.next(language);
  }

}
