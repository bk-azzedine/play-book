import {Component, inject, OnInit, output} from '@angular/core';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmCheckboxImports} from '@spartan-ng/ui-checkbox-helm';
import {HlmErrorDirective, HlmFormFieldComponent, HlmHintDirective} from '@spartan-ng/ui-formfield-helm';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import {validPassword} from '../../../core/validators/sync/password-strength.validator';
import {match} from '../../../core/validators/sync/password-match.validator';
import {NgIf} from '@angular/common';
import {email} from '../../../core/validators/sync/email-valid.validator';
import {Credentials} from '../../../store/models/credentials.model';
import {User} from '../../../store/models/user.model';
import {EmailValidator} from '../../../core/validators/async/email-not-taken.validator';


@Component({
  selector: 'app-sign-up-form',
  imports: [
    HlmInputDirective,
    HlmButtonDirective,
    HlmButtonDirective,
    HlmCheckboxImports,
    HlmFormFieldComponent,
    ReactiveFormsModule,
    HlmErrorDirective,
    NgIf
  ],

  templateUrl: './sign-up-form.component.html',
  styleUrl: './sign-up-form.component.css'
})
export class SignUpFormComponent {
  user = output<User>()
  emailValidator = inject(EmailValidator);
  private formBuilder = inject(FormBuilder);
  signInRequest = output<void>()


  userForm = this.formBuilder.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', {
      asyncValidators: [
        this.emailValidator.validate.bind(this.emailValidator),
      ],
      validators: [
        Validators.required,
        email()
      ],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8),
        validPassword()
      ],
      updateOn: "change"
    }),
    confirmPassword: new FormControl('', {
      validators: [
        Validators.required,
        match("password")
      ]
    })
  });

  onSubmit(){
    if (this.userForm.valid) {
      const { firstName, lastName, email, password } = this.userForm.value;
      this.user.emit({ firstName, lastName, email, password } as User);
    }
  }
  onSignIn() {
    this.signInRequest.emit();
  }

}
