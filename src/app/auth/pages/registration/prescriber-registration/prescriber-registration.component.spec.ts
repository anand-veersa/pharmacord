import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriberRegistrationComponent } from './prescriber-registration.component';

describe('PrescriberRegistrationComponent', () => {
  let component: PrescriberRegistrationComponent;
  let fixture: ComponentFixture<PrescriberRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriberRegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriberRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
