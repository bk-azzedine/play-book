import {Component, inject} from '@angular/core';
import {AccountVerificationComponent} from '../account-verification/account-verification.component';
import {Store} from '@ngrx/store';
import {ResendCode, ValidateAccount} from '../../../store/actions/auth.actions';


@Component({
  selector: 'app-account-verification-page',
  imports: [
    AccountVerificationComponent
  ],
  templateUrl: './account-verification-page.component.html',
  styleUrl: './account-verification-page.component.css'
})
export class AccountVerificationPageComponent {
  store = inject(Store)

  sendCode(code: string) {
    this.store.dispatch(ValidateAccount({code: code}))
  }

  resendCode($event: void) {
    this.store.dispatch(ResendCode())
  }
}
