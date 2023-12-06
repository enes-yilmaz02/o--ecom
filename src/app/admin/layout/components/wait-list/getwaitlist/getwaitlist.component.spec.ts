import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetwaitlistComponent } from './getwaitlist.component';

describe('GetwaitlistComponent', () => {
  let component: GetwaitlistComponent;
  let fixture: ComponentFixture<GetwaitlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GetwaitlistComponent]
    });
    fixture = TestBed.createComponent(GetwaitlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
