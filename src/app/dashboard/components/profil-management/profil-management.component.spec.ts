import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilManagementComponent } from './profil-management.component';

describe('ProfilManagementComponent', () => {
  let component: ProfilManagementComponent;
  let fixture: ComponentFixture<ProfilManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilManagementComponent]
    });
    fixture = TestBed.createComponent(ProfilManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
