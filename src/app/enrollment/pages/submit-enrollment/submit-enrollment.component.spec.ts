import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitEnrollmentComponent } from './submit-enrollment.component';

describe('SubmitEnrollmentComponent', () => {
  let component: SubmitEnrollmentComponent;
  let fixture: ComponentFixture<SubmitEnrollmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitEnrollmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitEnrollmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
