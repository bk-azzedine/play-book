import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingFinishedComponent } from './onboarding-finished.component';

describe('OnboardingFinishedComponent', () => {
  let component: OnboardingFinishedComponent;
  let fixture: ComponentFixture<OnboardingFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingFinishedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
