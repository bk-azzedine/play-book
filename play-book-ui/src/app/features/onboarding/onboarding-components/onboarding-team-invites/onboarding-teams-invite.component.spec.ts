import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTeamsInviteComponent } from './onboarding-teams-invite.component';

describe('TeamsInviteComponent', () => {
  let component: OnboardingTeamsInviteComponent;
  let fixture: ComponentFixture<OnboardingTeamsInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingTeamsInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingTeamsInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
