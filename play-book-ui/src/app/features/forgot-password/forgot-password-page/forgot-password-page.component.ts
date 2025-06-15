import {Component, inject} from '@angular/core';
import {EnterEmailComponent} from '../enter-email/enter-email.component';
import {
  AccountVerificationComponent
} from '../../account-activation/account-verification/account-verification.component';
import {Store} from '@ngrx/store';
import {SendResetPasswordEmail} from '../../../store/actions/auth.actions';
import {RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-forgot-password-page',
  imports: [
    RouterOutlet
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.css'
})
export class ForgotPasswordPageComponent {
}
