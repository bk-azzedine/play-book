import {Component, inject, input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {BrnSelectImports} from '@spartan-ng/brain/select';
import {HlmSelectImports, HlmSelectOptionComponent} from '@spartan-ng/ui-select-helm';
import {NgForOf, NgIf} from '@angular/common';
import {Team} from '../../../../store/models/team.model';
import {Store} from '@ngrx/store';
import {selectAllTeams} from '../../../../store/selectors/teams.selector';
import {TeamInviteRequest} from '../../../../core/requests/team-invite.request';
import {
  CreateTeamFailure,
  CreateTeamSuccess,
  Invite,
  InviteFailure,
  InviteSuccess
} from '../../../../store/actions/team.actions';
import {Navigate} from '../../../../store/actions/router.actions';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
import {Actions, ofType} from '@ngrx/effects';
import {Subject, takeUntil} from 'rxjs';
import {toast} from 'ngx-sonner';
import {email} from '../../../../core/validators/sync/email-valid.validator';

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
    HlmButtonDirective,
    HlmToasterComponent,
    NgIf,
    HlmFormFieldComponent,
    HlmLabelDirective
  ],
  templateUrl: './onboarding-teams-invite.component.html',
  styleUrl: './onboarding-teams-invite.component.css'
})
export class OnboardingTeamsInviteComponent implements OnInit, OnDestroy {
  store = inject(Store);
  formBuilder = inject(FormBuilder);
  selectedTeam: Team | undefined;
  teams: Team[] = [];
  private destroy$ = new Subject<void>();
  actions$ = inject(Actions);
  teamInvites = this.formBuilder.group({
    email: new FormControl('', email()),
    role: new FormControl('', Validators.required),
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  ngOnInit(): void {
    this.store.select(selectAllTeams).subscribe(teams => {
      if (teams)
      this.teams = teams;
    });

    this.actions$.pipe(
      ofType(InviteSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.success('Invite has been sent', {
        description: `${action.res}`
      });
    });

    // Handle error actions
    this.actions$.pipe(
      ofType(InviteFailure),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.error('Failed to invite to team', {
        description: action.error?.message || 'An error occurred while sending  the invite'
      });
    });
  }


  onInvite() {
      if (this.teamInvites.valid) {
        const email = this.teamInvites.get('email')?.value || '';
        const teamId = this.selectedTeam?.teamId || '';
        const role = this.teamInvites.get('role')?.value || 'member'; // Default to 'member' if not set
        const teamInvite: TeamInviteRequest = {
          email: email,
          teamId: teamId,
           role: role

        };
        this.store.dispatch(Invite({teamInvite}))
     }
    }

  onContinue() {
    this.store.dispatch(Navigate({path:'onboarding/finished'}));
  }

}
