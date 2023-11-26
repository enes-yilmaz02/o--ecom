import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutCreoterComponent } from './layout-creoter.component';

describe('LayoutCreoterComponent', () => {
  let component: LayoutCreoterComponent;
  let fixture: ComponentFixture<LayoutCreoterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LayoutCreoterComponent]
    });
    fixture = TestBed.createComponent(LayoutCreoterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
