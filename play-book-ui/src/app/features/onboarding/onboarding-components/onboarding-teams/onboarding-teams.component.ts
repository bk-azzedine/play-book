import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {Team} from '../../../../store/models/team.model';
import {Store} from '@ngrx/store';
import {CreateTeam, CreateTeamFailure, CreateTeamSuccess} from '../../../../store/actions/team.actions';
import {Navigate} from '../../../../store/actions/router.actions';
import {selectSelectedCompany} from '../../../../store/selectors/company.selector';
import {take} from 'rxjs/operators';
import {map} from 'rxjs';
import {Actions, ofType} from '@ngrx/effects';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
import {Subject, takeUntil} from 'rxjs';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-onboarding-teams',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HlmFormFieldComponent,
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmButtonDirective,
    HlmToasterComponent,
    HlmFormFieldComponent,

  ],
  templateUrl: './onboarding-teams.component.html',
  styleUrl: './onboarding-teams.component.css'
})
export class OnboardingTeamsComponent implements OnInit ,OnDestroy {

  private destroy$ = new Subject<void>();
  actions$ = inject(Actions);
  formBuilder = inject(FormBuilder);
  store = inject(Store);
  teamsForm = this.formBuilder.group({
    name: new FormControl(''),
    description: new FormControl('')
  })



  onSubmitSkip() {
    this.store.select(selectSelectedCompany).pipe(
      take(1),
      map(company => {
        const team  : Team = {
          teamId: '',
          spaces: null,
          name : "Default",
          description: "Default Team",
          companyId: company?.organizationId as string,
          members: null,
        }
        this.store.dispatch(CreateTeam({team: team, companyId: company?.organizationId as string}));
      })
    ).subscribe();
    this.store.dispatch(Navigate({path:'onboarding/teams/invite'}));
  }

  onCreateTeam() {
    if (this.teamsForm.valid) {
      const name = this.teamsForm.controls['name'].value;
      const description = this.teamsForm.controls['description'].value;
      this.store.select(selectSelectedCompany).pipe(
        take(1),
        map(company => {
          const team : Team = {
            teamId: '',
            spaces: null,
            name : name as string,
            description: description as string,
            companyId: company?.organizationId as string,
            members: null
          }
          console.log(team)
          this.store.dispatch(CreateTeam({team: team, companyId: company?.organizationId as string}));
        })
      ).subscribe();
    }
  }

  onContinueTeam() {
     this.store.dispatch(Navigate({path:'onboarding/teams/invite'}));
  }

  ngOnInit() {
    // Handle success actions
    this.actions$.pipe(
      ofType(CreateTeamSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.success('Team has been created', {
        description: `${action.team.name} was successfully created`
      });
    });

    // Handle error actions
    this.actions$.pipe(
      ofType(CreateTeamFailure),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.error('Failed to register team', {
        description: action.error?.message || 'An error occurred while registering the team'
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
