import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPrescriberComponent } from './select-prescriber.component';

describe('SelectPrescriberComponent', () => {
  let component: SelectPrescriberComponent;
  let fixture: ComponentFixture<SelectPrescriberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPrescriberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPrescriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
