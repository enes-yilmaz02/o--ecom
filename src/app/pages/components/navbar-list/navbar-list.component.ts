import { Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar-list',
  templateUrl: './navbar-list.component.html',
  styleUrls: ['./navbar-list.component.scss']
})
export class NavbarListComponent {
  stateOptions: any[] = [{ label: '🇹🇷 Tr', value: 'tr' }, { label: '🇬🇧 En', value: 'en' }];
  selectedLanguage: string = 'tr';

  constructor( private transloco: TranslocoService ) {}

setLanguage() {
  if(this.selectedLanguage=== 'tr'){
    this.transloco.setActiveLang('tr');
  }
  if(this.selectedLanguage=== 'en'){
    this.transloco.setActiveLang('en');
  }
}
}
