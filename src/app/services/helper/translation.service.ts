import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(private translateService: TranslocoService) {}

  translate(key: string): string {
    return this.translateService.translate(key);
  }
}
