import {Component, inject} from '@angular/core';
import {
    LoginRegisterIllustrationComponent
} from "../../../shared/components/login-register-illustration/login-register-illustration.component";
import {SignUpFormComponent} from '../sign-up-form/sign-up-form.component';
import {User} from '../../../store/models/user.model';
import {Store} from '@ngrx/store';

import {Navigate} from '../../../store/actions/router.actions';
import {RegisterUser} from '../../../store/actions/user.actions';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    LoginRegisterIllustrationComponent,
    SignUpFormComponent
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
   store = inject(Store)

  onRegister(user: User) {
   this.store.dispatch(RegisterUser({user}));
  }

  handleSignIn() {
    this.store.dispatch(Navigate({path: '/login'}));
  }
}
