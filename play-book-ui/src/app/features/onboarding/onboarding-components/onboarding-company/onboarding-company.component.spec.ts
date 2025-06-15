import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingCompanyComponent } from './onboarding-company.component';

describe('OnboardingCompanyComponent', () => {
  let component: OnboardingCompanyComponent;
  let fixture: ComponentFixture<OnboardingCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardingCompanyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
