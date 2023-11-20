import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetProductsComponent } from './get-products.component';

describe('GetProductsComponent', () => {
  let component: GetProductsComponent;
  let fixture: ComponentFixture<GetProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetProductsComponent]
    });
    fixture = TestBed.createComponent(GetProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
