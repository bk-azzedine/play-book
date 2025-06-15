import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentDocumentsComponent } from './recent-documents.component';

describe('RecentDocumentsComponent', () => {
  let component: RecentDocumentsComponent;
  let fixture: ComponentFixture<RecentDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
