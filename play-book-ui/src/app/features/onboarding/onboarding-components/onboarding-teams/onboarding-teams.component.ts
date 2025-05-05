import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {Team} from '../../../../store/models/team.model';
import {Store} from '@ngrx/store';
import {CreateTeam} from '../../../../store/actions/team.actions';
import {Navigate} from '../../../../store/actions/router.actions';
import {selectSelectedCompany} from '../../../../store/selectors/company.selector';
import {take} from 'rxjs/operators';
import {map} from 'rxjs';


@Component({
  selector: 'app-onboarding-teams',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmButtonDirective
  ],
  templateUrl: './onboarding-teams.component.html',
  styleUrl: './onboarding-teams.component.css'
})
export class OnboardingTeamsComponent {
  formBuilder = inject(FormBuilder);
  store = inject(Store);
  teamsForm = this.formBuilder.group({
    name: new FormControl(''),
  })



  onSubmitSkip() {
    this.store.select(selectSelectedCompany).pipe(
      take(1),
      map(company => {
        const team  : Team = {
          spaces: null,
          name : "Default",
          companyId: company?.organizationId as string
        }
        this.store.dispatch(CreateTeam({team: team, companyId: company?.organizationId as string}));
      })
    ).subscribe();
    this.store.dispatch(Navigate({path:'onboarding/teams/invite'}));
  }

  onCreateTeam() {
    if (this.teamsForm.valid) {
      const name = this.teamsForm.controls['name'].value;
      this.store.select(selectSelectedCompany).pipe(
        take(1),
        map(company => {
          const team : Team = {
            spaces: null,
            name : name as string,
            companyId: company?.organizationId as string
          }
          this.store.dispatch(CreateTeam({team: team, companyId: company?.organizationId as string}));
        })
      ).subscribe();
    }
  }

  onContinueTeam() {
     this.store.dispatch(Navigate({path:'onboarding/teams/invite'}));
  }
}
