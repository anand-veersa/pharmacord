import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSecurityQuestionsComponent } from './change-security-questions.component';

describe('ChangeSecurityQuestionsComponent', () => {
  let component: ChangeSecurityQuestionsComponent;
  let fixture: ComponentFixture<ChangeSecurityQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeSecurityQuestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
