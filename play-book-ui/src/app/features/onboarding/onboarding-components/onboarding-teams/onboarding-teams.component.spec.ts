import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTeamsComponent } from './onboarding-teams.component';

describe('OnboardingTeamsComponent', () => {
  let component: OnboardingTeamsComponent;
  let fixture: ComponentFixture<OnboardingTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
