import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUploadDocumentsComponent } from './custom-upload-documents.component';

describe('CustomUploadDocumentsComponent', () => {
  let component: CustomUploadDocumentsComponent;
  let fixture: ComponentFixture<CustomUploadDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomUploadDocumentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomUploadDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
