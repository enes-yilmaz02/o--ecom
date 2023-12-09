import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetpasswordCodeComponent } from './resetpassword-code.component';

describe('ResetpasswordCodeComponent', () => {
  let component: ResetpasswordCodeComponent;
  let fixture: ComponentFixture<ResetpasswordCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetpasswordCodeComponent]
    });
    fixture = TestBed.createComponent(ResetpasswordCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
