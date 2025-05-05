import {Component, inject, input, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmSelectImports, HlmSelectOptionComponent} from '@spartan-ng/ui-select-helm';
import {NgForOf} from '@angular/common';
import {Team} from '../../../../store/models/team.model';
import {Store} from '@ngrx/store';
import {selectAllTeams} from '../../../../store/selectors/teams.selector';
import {TeamInviteRequest} from '../../../../core/requests/team-invite.request';
import {Invite} from '../../../../store/actions/team.actions';
import {Navigate} from '../../../../store/actions/router.actions';

@Component({
  selector: 'app-onboarding-teams-invite',
  imports: [
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmButtonDirective,
    HlmLabelDirective,
    HlmInputDirective,
    BrnSelectImports,
    HlmSelectImports,
    NgForOf,
    HlmSelectOptionComponent,
    HlmSelectOptionComponent,
    HlmButtonDirective
  ],
  templateUrl: './onboarding-teams-invite.component.html',
  styleUrl: './onboarding-teams-invite.component.css'
})
export class OnboardingTeamsInviteComponent implements OnInit {
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  selectedTeam: Team | undefined;
  teams: Team[] = [];

  teamInvites = this.formBuilder.group({
    email: [''],
  })


  ngOnInit(): void {
    this.store.select(selectAllTeams).subscribe(teams => {
      if (teams)
      this.teams = teams;
    });
  }


  onInvite() {
      if (this.teamInvites.valid) {
        const email = this.teamInvites.get('email')?.value || '';
        const teamId = this.selectedTeam?.id || '';
        const teamInvite: TeamInviteRequest = {
          email: email,
          teamId: teamId
        };
        this.store.dispatch(Invite({teamInvite}))
     }
    }

  onContinue() {
    this.store.dispatch(Navigate({path:'onboarding/finished'}));
  }

}
