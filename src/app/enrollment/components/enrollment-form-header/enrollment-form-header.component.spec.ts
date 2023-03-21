import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentFormHeaderComponent } from './enrollment-form-header.component';

describe('EnrollmentFormHeaderComponent', () => {
  let component: EnrollmentFormHeaderComponent;
  let fixture: ComponentFixture<EnrollmentFormHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnrollmentFormHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EnrollmentFormHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
