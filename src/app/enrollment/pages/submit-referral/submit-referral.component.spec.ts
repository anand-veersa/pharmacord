import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitReferralComponent } from './submit-referral.component';

describe('SubmitReferralComponent', () => {
  let component: SubmitReferralComponent;
  let fixture: ComponentFixture<SubmitReferralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitReferralComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
