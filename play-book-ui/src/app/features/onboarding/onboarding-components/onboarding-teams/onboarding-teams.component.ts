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
  commService = inject(CommService);

  teamsForm = this.formBuilder.group({
    name: new FormControl(''),
  })



  onSubmitSkip() {
    const team: Team = {
      name: 'Default',
      organizationId: ''
    }
    this.commService.setCom({
      messageType: 'Team',
      message: team
    })
  }

  onCreateTeam() {
    if (this.teamsForm.valid) {
    }
    const {name} = this.teamsForm.value;
    this.commService.setCom({
      messageType: 'Team',
      message: {name} as Team
    })
  }

  onContinueTeam() {
      this.commService.setCom({messageType: 'Navigation', message:'onboarding/teams/invite'});
  }
}
