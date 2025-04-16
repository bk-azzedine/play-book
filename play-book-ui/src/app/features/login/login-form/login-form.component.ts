import {Component, inject, output} from '@angular/core';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NgIf, NgOptimizedImage} from '@angular/common';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmCheckboxComponent} from '@spartan-ng/ui-checkbox-helm';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Credentials} from '../../../store/models/credentials.model';
import {Actions, ofType} from '@ngrx/effects';
import {AuthActionTypes} from '../../../store/actions/auth.actions';
import {map} from 'rxjs';

@Component({
  selector: 'app-login-form',
  imports: [
    HlmInputDirective,
    HlmButtonDirective,
    HlmButtonDirective,
    HlmCheckboxComponent,
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmErrorDirective,
    NgIf
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  credentials = output<Credentials>()
  actions = inject(Actions);
  signUpRequest = output<void>()
  loginError: string | null = null;

  private formBuilder = inject(FormBuilder);
  credentialsForm = this.formBuilder.group({
    email : new FormControl('',Validators.required),
    password : new FormControl('',Validators.required)
  })

  onSubmit(){
    if (this.credentialsForm.valid) {
      const { email, password } = this.credentialsForm.value;

      if (email && password) {
        this.credentials.emit({ email, password} as Credentials);
      }
    }
  }
  ngOnInit() {
    this.actions.pipe(
      ofType(AuthActionTypes.LoginFailure),
      map(action => action.error)
    ).subscribe(error => {
      this.loginError = error;
    });
  }

  onSignUp() {
      this.signUpRequest.emit();
  }
}
