import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMedicationComponent } from './select-medication.component';

describe('SelectMedicationComponent', () => {
  let component: SelectMedicationComponent;
  let fixture: ComponentFixture<SelectMedicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectMedicationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMedicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
