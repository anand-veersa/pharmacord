import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsAndFormsComponent } from './tools-and-forms.component';

describe('ToolsAndFormsComponent', () => {
  let component: ToolsAndFormsComponent;
  let fixture: ComponentFixture<ToolsAndFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolsAndFormsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsAndFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
