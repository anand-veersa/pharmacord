import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectDocusignComponent } from './redirect-docusign.component';

describe('RedirectDocuSignComponent', () => {
  let component: RedirectDocusignComponent;
  let fixture: ComponentFixture<RedirectDocusignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RedirectDocusignComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RedirectDocusignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
