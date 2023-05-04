import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthcareProviderComponent } from './add-healthcare-provider.component';

describe('AddHealthcareProviderComponent', () => {
  let component: AddHealthcareProviderComponent;
  let fixture: ComponentFixture<AddHealthcareProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHealthcareProviderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddHealthcareProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
