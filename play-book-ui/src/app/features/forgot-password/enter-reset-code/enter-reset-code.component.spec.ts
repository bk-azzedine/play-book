import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterResetCodeComponent } from './enter-reset-code.component';

describe('EnterResetCodeComponent', () => {
  let component: EnterResetCodeComponent;
  let fixture: ComponentFixture<EnterResetCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnterResetCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterResetCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
