import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteDocumentsComponent } from './favorite-documents.component';

describe('FavoriteDocumentsComponent', () => {
  let component: FavoriteDocumentsComponent;
  let fixture: ComponentFixture<FavoriteDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
