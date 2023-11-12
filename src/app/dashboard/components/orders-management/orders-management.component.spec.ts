import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersManagementComponent } from './orders-management.component';

describe('OrdersManagementComponent', () => {
  let component: OrdersManagementComponent;
  let fixture: ComponentFixture<OrdersManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersManagementComponent]
    });
    fixture = TestBed.createComponent(OrdersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
