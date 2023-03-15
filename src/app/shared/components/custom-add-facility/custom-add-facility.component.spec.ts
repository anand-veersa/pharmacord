import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAddFacilityComponent } from './custom-add-facility.component';

describe('CustomAddFacilityComponent', () => {
  let component: CustomAddFacilityComponent;
  let fixture: ComponentFixture<CustomAddFacilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomAddFacilityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomAddFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
