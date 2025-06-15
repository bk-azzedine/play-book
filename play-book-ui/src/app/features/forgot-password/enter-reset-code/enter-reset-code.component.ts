import {Component, inject, OnInit, output} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Store} from '@ngrx/store';
import {SendResetPasswordEmail, ValidateResetCode, ValidateResetCodeSuccess} from '../../../store/actions/auth.actions';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {Actions, ofType} from '@ngrx/effects';
import {Subject, takeUntil} from 'rxjs';
import {RegisterSuccess} from '../../../store/actions/company.actions';
import {toast} from 'ngx-sonner';
import {Navigate} from '../../../store/actions/router.actions';

@Component({
  selector: 'app-enter-reset-code',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HlmButtonDirective,
    HlmInputDirective
  ],
  templateUrl: './enter-reset-code.component.html',
  styleUrl: './enter-reset-code.component.css'
})
export class EnterResetCodeComponent implements OnInit{

  private formBuilder = inject(FormBuilder);
  actions$ = inject(Actions);
  message: string | null = null;
  store = inject(Store)
  private destroy$ = new Subject<void>();
  codeForm = this.formBuilder.group({
    code: new FormControl('',

      Validators.required
    ),

  })

  onSubmit() {
    if (this.codeForm.valid) {
      const formValue = this.codeForm.value;
      if (formValue && formValue.code) {
        this.store.dispatch(ValidateResetCode({code: formValue.code}));
      }
    }
  }
  ngOnInit(): void {
    // Listen for successful code validation
    this.actions$.pipe(
      ofType(ValidateResetCodeSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      // Get the current form value when the action succeeds
      const currentCode = this.codeForm.get('code')?.value;
      if (currentCode) {
        this.store.dispatch(Navigate({
          path: ['forgot-password', 'reset-password', currentCode]
        }));
      }
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
