import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInsuranceComponent } from './select-insurance.component';

describe('SelectInsuranceComponent', () => {
  let component: SelectInsuranceComponent;
  let fixture: ComponentFixture<SelectInsuranceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectInsuranceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
