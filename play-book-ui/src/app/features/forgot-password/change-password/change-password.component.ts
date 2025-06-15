import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from '@angular/common';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {Store} from '@ngrx/store';
import {
  ResetPassword,
  ResetPasswordSuccess,
  SendResetPasswordEmail,
  ValidateResetCodeSuccess
} from '../../../store/actions/auth.actions';
import {validPassword} from '../../../core/validators/sync/password-strength.validator';
import {match} from '../../../core/validators/sync/password-match.validator';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ActivatedRoute} from '@angular/router';
import {Actions, ofType} from '@ngrx/effects';
import {Subject, takeUntil} from 'rxjs';
import {Navigate} from '../../../store/actions/router.actions';

@Component({
  selector: 'app-change-password',
  imports: [
    ReactiveFormsModule,
    NgIf,
    HlmErrorDirective,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmErrorDirective,
    HlmButtonDirective,
    HlmInputDirective
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  private formBuilder = inject(FormBuilder);
  actions$ = inject(Actions);
  private destroy$ = new Subject<void>();
  message: string | null = null;
  store = inject(Store)
  private route = inject(ActivatedRoute);
  changePasswordForm = this.formBuilder.group({
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

  })

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      if (formValue && formValue.password) {
        this.store.dispatch(ResetPassword({password: formValue.password, code : this.getCodeFromUrl()}));
      }
    }
  }
  private getCodeFromUrl(): string {
    return this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    // Listen for successful code validation
    this.actions$.pipe(
      ofType(ResetPasswordSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
        this.store.dispatch(Navigate({
          path: ['login']
        }));
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
