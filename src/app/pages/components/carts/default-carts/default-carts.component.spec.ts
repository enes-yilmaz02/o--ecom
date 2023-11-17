import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultCartsComponent } from './default-carts.component';

describe('DefaultCartsComponent', () => {
  let component: DefaultCartsComponent;
  let fixture: ComponentFixture<DefaultCartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultCartsComponent]
    });
    fixture = TestBed.createComponent(DefaultCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
