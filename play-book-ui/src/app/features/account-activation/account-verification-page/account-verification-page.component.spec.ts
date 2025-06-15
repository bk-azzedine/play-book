import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountVerificationPageComponent } from './account-verification-page.component';

describe('WelcomePageComponent', () => {
  let component: AccountVerificationPageComponent;
  let fixture: ComponentFixture<AccountVerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountVerificationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
