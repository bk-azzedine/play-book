import {Component, inject, OnInit, output} from '@angular/core';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {Actions, ofType} from '@ngrx/effects';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {map} from 'rxjs';
import {NgIf} from '@angular/common';
import {HlmErrorDirective, HlmHintDirective} from '@spartan-ng/ui-formfield-helm';
import {AuthActionTypes} from '../../../store/actions/auth.actions';

@Component({
  selector: 'app-account-verification',
  imports: [
    HlmInputDirective,
    HlmButtonDirective,
    ReactiveFormsModule,
    NgIf,
    HlmErrorDirective
  ],
  templateUrl: './account-verification.component.html',
  styleUrl: './account-verification.component.css'
})
export class AccountVerificationComponent implements  OnInit{
  actions = inject(Actions)
  activation_code = output<string>()
  resend_code = output<void>()
  private formBuilder = inject(FormBuilder);
  verificationError: string | null = null;
  message: string | null = null;

  activationForm = this.formBuilder.group({
    code : new FormControl('',Validators.required),

  })

  onSubmit() {
    if (this.activationForm.valid) {
      const formValue = this.activationForm.value;
      if (formValue && formValue.code) {
        this.activation_code.emit(formValue.code);
      }
    }
  }

  onSubmitResent() {
    this.resend_code.emit()
  }
  ngOnInit() {
    this.actions.pipe(
      ofType(AuthActionTypes.ValidationFailure, AuthActionTypes.ResendCodeFailure),
      map(action => action.error)
    ).subscribe(error => {
      this.showError(error);
    });

    this.actions.pipe(
      ofType(AuthActionTypes.ResendCodeComplete),
      map(action => action.res)
    ).subscribe(message => {
      this.showMessage(message);
    });
  }
  showMessage(message: string, duration: number = 5000) {
    this.message = message;

    // Clear the message after the specified duration
    setTimeout(() => {
      this.message = null;
    }, duration);
  }

  showError(error: string, duration: number = 5000) {
    this.verificationError = error;

    // Clear the error after the specified duration
    setTimeout(() => {
      this.verificationError = null;
    }, duration);
  }

}
