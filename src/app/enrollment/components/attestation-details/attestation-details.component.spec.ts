import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttestationDetailsComponent } from './attestation-details.component';

describe('AttestationDetailsComponent', () => {
  let component: AttestationDetailsComponent;
  let fixture: ComponentFixture<AttestationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttestationDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AttestationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
