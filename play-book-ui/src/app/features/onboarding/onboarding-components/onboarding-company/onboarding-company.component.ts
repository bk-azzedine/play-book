import {Component, inject, output} from '@angular/core';
import {ProgressBarComponent} from "../../shared/progress-bar/progress-bar.component";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmSelectImports} from '@spartan-ng/ui-select-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {NgIf} from '@angular/common';
import {Company} from '../../../../store/models/company.model';
import {CommService} from '../../../../core/services/comm/comm.service';

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
  ],
  templateUrl: './onboarding-company.component.html',
  styleUrl: './onboarding-company.component.css'
})
export class OnboardingCompanyComponent {
  formBuilder = inject(FormBuilder);
  commService = inject(CommService);

  companyForm = this.formBuilder.group({
    name: new FormControl(''),
    field: new FormControl('')
  })

  onSubmit() {
    if (this.companyForm.valid) {
    }
    const {name, field} = this.companyForm.value;
    this.commService.setCom({
      messageType: 'Company',
      message: {name, field} as Company
    })
  }


  onSubmitSkip() {
    const company: Company = {
      name: 'Default',
      field: 'DEFAULT',
    }
    this.commService.setCom({
      messageType: 'Company',
      message: company
    })
  }
}
