import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPrescriptionComponent } from './custom-prescription.component';

describe('CustomPrescriptionComponent', () => {
  let component: CustomPrescriptionComponent;
  let fixture: ComponentFixture<CustomPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomPrescriptionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
