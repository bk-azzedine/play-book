import {Component, inject} from '@angular/core';
import {BrnSelectComponent, BrnSelectContentComponent, BrnSelectValueComponent} from '@spartan-ng/brain/select';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ProgressBarComponent} from '../../shared/progress-bar/progress-bar.component';
import {HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {CommService} from '../../../../core/services/comm/comm.service';
import {Company} from '../../../../store/models/company.model';
import {Team} from '../../../../store/models/team.model';
import {Store} from '@ngrx/store';
import {CreateTeam} from '../../../../store/actions/team.actions';
import {Navigate} from '../../../../store/actions/router.actions';
import {selectCompanyId} from '../../../../store/selectors/company.selector';
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
  commService = inject(CommService);

  teamsForm = this.formBuilder.group({
    name: new FormControl(''),
  })



  onSubmitSkip() {
    const team: Team = {
      name: 'Default',
      organizationId: ''
    }
    this.store.dispatch(CreateTeam({team: team}));
  }

  onCreateTeam() {
    if (this.teamsForm.valid) {
      const name = this.teamsForm.controls['name'].value;
      this.store.select(selectCompanyId).pipe(
        take(1),
        map(companyId => {
          const team : Team = {
            name : name as string,
            organizationId: companyId as string,
          }
          this.store.dispatch(CreateTeam({team: team}));
        })
      ).subscribe();
    }
  }

  onContinueTeam() {
     this.store.dispatch(Navigate({path:'onboarding/teams/invite'}));
  }
}
