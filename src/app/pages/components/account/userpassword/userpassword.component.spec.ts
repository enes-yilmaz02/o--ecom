import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpasswordComponent } from './userpassword.component';

describe('UserpasswordComponent', () => {
  let component: UserpasswordComponent;
  let fixture: ComponentFixture<UserpasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserpasswordComponent]
    });
    fixture = TestBed.createComponent(UserpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
