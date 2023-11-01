import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddproductFormComponent } from './addproduct-form.component';

describe('AddproductFormComponent', () => {
  let component: AddproductFormComponent;
  let fixture: ComponentFixture<AddproductFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddproductFormComponent]
    });
    fixture = TestBed.createComponent(AddproductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
