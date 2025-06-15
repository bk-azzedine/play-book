import {Component, inject, OnInit} from '@angular/core';
import {LoginFormComponent} from '../login-form/login-form.component';
import {
  LoginRegisterIllustrationComponent
} from '../../../shared/components/login-register-illustration/login-register-illustration.component';
import {Credentials} from '../../../store/models/credentials.model';
import {Store} from '@ngrx/store';
import {AuthActionTypes, Login} from '../../../store/actions/auth.actions';
import {Navigate} from '../../../store/actions/router.actions';

@Component({
  selector: 'app-login-page',
  imports: [
    LoginFormComponent,
    LoginRegisterIllustrationComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent  {
  store = inject(Store);

  onLogin(credentials: Credentials) {
    this.store.dispatch(Login({ credentials }));
  }

  handleSignUp() {
    this.store.dispatch(Navigate({ path: '/signup' }));
  }
  handleForgotPassword() {
    this.store.dispatch(Navigate({ path: '/forgot-password/email' }));
  }
}
