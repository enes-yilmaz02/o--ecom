import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExFavoritesComponent } from './ex-favorites.component';

describe('ExFavoritesComponent', () => {
  let component: ExFavoritesComponent;
  let fixture: ComponentFixture<ExFavoritesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExFavoritesComponent]
    });
    fixture = TestBed.createComponent(ExFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
