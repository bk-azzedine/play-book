import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftDocumentsComponent } from './draft-documents.component';

describe('DraftDocumentsComponent', () => {
  let component: DraftDocumentsComponent;
  let fixture: ComponentFixture<DraftDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraftDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraftDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
