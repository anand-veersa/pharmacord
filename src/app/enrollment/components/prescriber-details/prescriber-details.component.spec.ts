import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriberDetailsComponent } from './prescriber-details.component';

describe('PrescriberDetailsComponent', () => {
  let component: PrescriberDetailsComponent;
  let fixture: ComponentFixture<PrescriberDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriberDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrescriberDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
