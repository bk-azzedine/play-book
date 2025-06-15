import {Component, inject, OnInit, output} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Actions, ofType} from '@ngrx/effects';
import {AuthActionTypes, SendResetPasswordEmail} from '../../../store/actions/auth.actions';
import {map} from 'rxjs';
import {HlmErrorDirective} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {email} from '../../../core/validators/sync/email-valid.validator';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-enter-email',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HlmInputDirective,
    HlmButtonDirective
  ],
  templateUrl: './enter-email.component.html',
  styleUrl: './enter-email.component.css'
})
export class EnterEmailComponent {
  private formBuilder = inject(FormBuilder);

  message: string | null = null;
  store = inject(Store)

  emailForm = this.formBuilder.group({
    email: new FormControl('', {
      validators: [
        Validators.required,
        email()
      ],
    }),

  })

  onSubmit() {
    if (this.emailForm.valid) {
      const formValue = this.emailForm.value;
      if (formValue && formValue.email) {
        this.store.dispatch(SendResetPasswordEmail({email: formValue.email}));
      }
    }
  }


}
