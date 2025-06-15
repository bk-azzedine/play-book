import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterIllustrationComponent } from './login-register-illustration.component';

describe('LoginRegisterIllustrationComponent', () => {
  let component: LoginRegisterIllustrationComponent;
  let fixture: ComponentFixture<LoginRegisterIllustrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRegisterIllustrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginRegisterIllustrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
