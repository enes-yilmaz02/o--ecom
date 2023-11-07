import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFavoritesComponent } from './default-favorites.component';

describe('DefaultFavoritesComponent', () => {
  let component: DefaultFavoritesComponent;
  let fixture: ComponentFixture<DefaultFavoritesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultFavoritesComponent]
    });
    fixture = TestBed.createComponent(DefaultFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
