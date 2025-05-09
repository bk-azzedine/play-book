import {Component, inject, OnInit, output} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmSelectImports} from '@spartan-ng/ui-select-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NgIf} from '@angular/common';
import {Company} from '../../../../store/models/company.model';
import {Store} from '@ngrx/store';
import {RegisterCompany, RegisterSuccess} from '../../../../store/actions/company.actions';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
import {Actions, ofType} from '@ngrx/effects';
import {Subject, takeUntil} from 'rxjs';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-onboarding-company',
  imports: [
    BrnSelectImports,
    HlmSelectImports,
    ReactiveFormsModule,
    HlmLabelDirective,
    HlmFormFieldComponent,
    HlmErrorDirective,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    NgIf,
    HlmToasterComponent,
  ],
  templateUrl: './onboarding-company.component.html',
  styleUrl: './onboarding-company.component.css'
})
export class OnboardingCompanyComponent  implements OnInit {
  formBuilder = inject(FormBuilder);
  store = inject(Store);
  actions$ = inject(Actions);
  private destroy$ = new Subject<void>();

  companyForm = this.formBuilder.group({
    name: new FormControl(''),
    field: new FormControl('')
  })

  onSubmit() {
    if (this.companyForm.valid) {
    }
    const {name, field} = this.companyForm.value;
    this.store.dispatch(RegisterCompany({company: {name, field} as Company}));
  }


  onSubmitSkip() {
    const company: Company = {
      name: 'Default',
      field: 'DEFAULT',
      teams: null,
      color: undefined,
      initial: undefined,
    }
    this.store.dispatch(RegisterCompany({company: company}));
  }
  ngOnInit() {

    this.actions$.pipe(
      ofType(RegisterSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {

      toast('Company has been registered', {
        description: `${action.company.name} was successfully registered`,
        action: {
          label: 'View Details',
          onClick: () => console.log('View company details')
        }
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
