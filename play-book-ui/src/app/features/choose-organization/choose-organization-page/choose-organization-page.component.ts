import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MiniNavComponent} from '../components/mini-nav/mini-nav.component';
import {CompaniesComponent} from '../components/companies/companies.component';
import {NgForOf, NgIf} from '@angular/common';
import {Store} from '@ngrx/store';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {Company} from '../../../store/models/company.model';
import {LoadCompanies, RegisterCompany, RegisterSuccess} from '../../../store/actions/company.actions';
import {selectAllCompanies} from '../../../store/selectors/company.selector';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';

import {HlmDialogContentComponent} from '@spartan-ng/ui-dialog-helm';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmSelectOptionComponent, HlmSelectTriggerComponent} from '@spartan-ng/ui-select-helm';

import {HlmRadioComponent, HlmRadioIndicatorComponent} from '@spartan-ng/ui-radiogroup-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {BrnDialogComponent, BrnDialogContentDirective, BrnDialogTriggerDirective} from '@spartan-ng/brain/dialog';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {lucidePlus} from '@ng-icons/lucide';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {BrnSelectComponent, BrnSelectContentComponent, BrnSelectValueComponent} from '@spartan-ng/brain/select';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {NgScrollbar} from 'ngx-scrollbar';
import {SpaceVisibilityEnum} from '../../../store/models/enums/space-visibility.enum';
import {heroPlus} from '@ng-icons/heroicons/outline';
import {Actions, ofType} from '@ngrx/effects';
import {toast} from 'ngx-sonner';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';

@Component({
  selector: 'app-choose-organization-page',
  imports: [
    MiniNavComponent,
    CompaniesComponent,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    HlmDialogContentComponent,
    HlmErrorDirective,
    HlmErrorDirective,
    HlmFormFieldComponent,
    HlmSelectOptionComponent,
    HlmFormFieldComponent,
    HlmButtonDirective,
    BrnDialogComponent,
    BrnDialogTriggerDirective,
    NgIcon,
    HlmButtonDirective,
    HlmDialogContentComponent,
    HlmDialogContentComponent,
    BrnDialogContentDirective,
    HlmDialogContentComponent,
    NgIf,
    HlmInputDirective,
    HlmErrorDirective,
    BrnSelectContentComponent,
    BrnSelectValueComponent,
    HlmLabelDirective,
    HlmFormFieldComponent,
    HlmSelectOptionComponent,
    HlmSelectTriggerComponent,
    HlmSelectOptionComponent,
    HlmLabelDirective,
    BrnSelectComponent,
    HlmToasterComponent
  ],
  templateUrl: './choose-organization-page.component.html',
  providers: [
    provideIcons({lucidePlus,heroPlus})
  ],
  standalone: true,
  styleUrl: './choose-organization-page.component.css'
})
export class ChooseOrganizationPageComponent implements OnInit {
  orgs: Company[] = [];
  store = inject(Store);
  formBuilder = inject(FormBuilder)
  actions$ = inject(Actions);
  private destroy$ = new Subject<void>();
  @ViewChild('dialog') dialogRef!: BrnDialogComponent;
  private subscription: Subscription | undefined;
  organizationForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    field: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.loadRecentDocs();
    this.subscription = this.store.select(selectAllCompanies).subscribe(orgs => {
      this.orgs = orgs;
    });

    this.actions$.pipe(
      ofType(RegisterSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {

      toast('Company has been registered', {
        description: `${action.company.name} was successfully registered`
      });
    });
  }

  loadRecentDocs(): void {
    this.store.dispatch(LoadCompanies());
  }



  saveOrganization() {
    if (this.organizationForm.valid) {
    }
    const {name, field} = this.organizationForm.value;
    this.store.dispatch(RegisterCompany({company: {name, field} as Company}));
  }


}
