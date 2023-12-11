import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordPasswordComponent } from './reset-password-password.component';

describe('ResetPasswordPasswordComponent', () => {
  let component: ResetPasswordPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordPasswordComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
