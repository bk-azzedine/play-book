import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {NgIcon, provideIcons} from "@ng-icons/core";
import { TeamCardComponent} from './team-card/team-card.component';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {Store} from '@ngrx/store';
import {Team} from '../../../../store/models/team.model';
import {map, Subject, Subscription, takeUntil} from 'rxjs';
import {selectUserTeams} from '../../../../store/selectors/teams.selector';
import {selectUserId} from '../../../../store/selectors/auth.selector';
import {Navigate} from '../../../../store/actions/router.actions';
import {lucidePlus} from '@ng-icons/lucide';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HlmErrorDirective, HlmFormFieldComponent} from '@spartan-ng/ui-formfield-helm';
import {HlmLabelDirective} from '@spartan-ng/ui-label-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmDialogContentComponent} from '@spartan-ng/ui-dialog-helm';
import {BrnDialogComponent, BrnDialogContentDirective, BrnDialogTriggerDirective} from '@spartan-ng/brain/dialog';
import {SpaceVisibilityEnum} from '../../../../store/models/enums/space-visibility.enum';
import {selectSelectedCompany} from '../../../../store/selectors/company.selector';
import {take} from 'rxjs/operators';
import {CreateTeam, CreateTeamFailure, CreateTeamSuccess} from '../../../../store/actions/team.actions';
import {Actions, ofType} from '@ngrx/effects';
import {toast} from 'ngx-sonner';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
@Component({
  selector: 'app-teams',
  standalone: true,
  providers: [provideIcons({lucidePlus})],
  imports: [
    BrnDialogComponent,
    HlmDialogContentComponent,
    NgForOf,
    NgIcon,
    TeamCardComponent,
    HlmButtonDirective,
    FormsModule,
    ReactiveFormsModule,
    HlmInputDirective,
    BrnDialogTriggerDirective,
    HlmButtonDirective,
    BrnDialogContentDirective,
    NgIf,
    HlmButtonDirective,
    HlmDialogContentComponent,
    HlmInputDirective,
    HlmInputDirective,
    HlmErrorDirective,
    HlmToasterComponent,
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements  OnInit , OnDestroy{

  formBuilder = inject(FormBuilder)

  private destroy$ = new Subject<void>();
  actions$ = inject(Actions);
  store = inject(Store);
  userTeams:Team[] = [];
  private subscription = new Subscription();
  userId: string | undefined;
  teamsForm = this.formBuilder.group({
    name: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    description: new FormControl('', [Validators.maxLength(100)] ),
  })

  ngOnInit(): void {

     this.subscription.add(
       this.store.select(selectUserTeams).subscribe((teams: Team[]) => {
         this.userTeams = teams || [];
         console.log('Teams:', this.userTeams);
       }

     ))
    this.subscription.add(
      this.store.select(selectUserId).subscribe(userId => {
        this.userId = userId;
      })
    );

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
    this.subscription.unsubscribe();
   }

  onTeamSelected(teamId: string): void {
    this.store.dispatch(Navigate({path: ['home', 'team', teamId]}))

  }

  onViewTeam(teamId: string): void {
    this.store.dispatch(Navigate({path: ['home', 'team', teamId]}))

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


}
