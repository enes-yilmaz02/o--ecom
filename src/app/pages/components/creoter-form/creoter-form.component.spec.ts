import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreoterFormComponent } from './creoter-form.component';

describe('CreoterFormComponent', () => {
  let component: CreoterFormComponent;
  let fixture: ComponentFixture<CreoterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreoterFormComponent]
    });
    fixture = TestBed.createComponent(CreoterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
