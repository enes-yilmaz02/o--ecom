import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentCartsComponent } from './content-carts.component';

describe('ContentCartsComponent', () => {
  let component: ContentCartsComponent;
  let fixture: ComponentFixture<ContentCartsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentCartsComponent]
    });
    fixture = TestBed.createComponent(ContentCartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
