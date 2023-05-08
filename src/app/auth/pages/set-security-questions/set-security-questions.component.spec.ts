import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetSecurityQuestionsComponent } from './set-security-questions.component';

describe('SetSecurityQuestionsComponent', () => {
  let component: SetSecurityQuestionsComponent;
  let fixture: ComponentFixture<SetSecurityQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetSecurityQuestionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SetSecurityQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
