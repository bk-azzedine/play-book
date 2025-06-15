import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {NgIcon, provideIcons} from '@ng-icons/core';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription, takeUntil} from 'rxjs';
import {Team} from '../../../../store/models/team.model';
import {take} from 'rxjs/operators';

import {Navigate} from '../../../../store/actions/router.actions';
import {selectTeam} from '../../../../store/selectors/teams.selector';
import {heroUsers} from '@ng-icons/heroicons/outline';
import {featherMoreVertical} from '@ng-icons/feather-icons';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {SpaceCardComponent} from '../spaces/components/space-card/space-card.component';
import {
  HlmCarouselComponent,
  HlmCarouselContentComponent,
  HlmCarouselItemComponent, HlmCarouselNextComponent, HlmCarouselPreviousComponent
} from '@spartan-ng/ui-carousel-helm';
import {BrnDialogComponent, BrnDialogContentDirective, BrnDialogTriggerDirective} from '@spartan-ng/brain/dialog';
import {HlmMenuComponent} from '@spartan-ng/ui-menu-helm';
import {BrnMenuTriggerDirective} from '@spartan-ng/brain/menu';
import {lucidePlus} from '@ng-icons/lucide';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {SpaceVisibilityEnum} from '../../../../store/models/enums/space-visibility.enum';
import {HlmDialogContentComponent} from '@spartan-ng/ui-dialog-helm';
import {HlmInputDirective} from '@spartan-ng/ui-input-helm';
import {HlmErrorDirective} from '@spartan-ng/ui-formfield-helm';
import {email} from '../../../../core/validators/sync/email-valid.validator';
import {MultipleTeamInviteRequest} from '../../../../core/requests/multiple-team-invite.request';
import {InviteMultiple, InviteMultipleSuccess} from '../../../../store/actions/team.actions';
import {Actions, ofType} from '@ngrx/effects';
import {CreateSpaceFailure, CreateSpaceSuccess} from '../../../../store/actions/space.actions';
import {toast} from 'ngx-sonner';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';



@Component({
  selector: 'app-team',
  imports: [
    NgIcon,
    NgForOf,
    UpperCasePipe,
    HlmButtonDirective,
    SpaceCardComponent,
    HlmCarouselComponent,
    HlmCarouselContentComponent,
    HlmCarouselItemComponent,
    HlmCarouselPreviousComponent,
    HlmCarouselNextComponent,
    HlmMenuComponent,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    BrnDialogComponent,
    BrnDialogContentDirective,
    ReactiveFormsModule,
    HlmDialogContentComponent,
    BrnDialogTriggerDirective,
    NgIf,
    HlmInputDirective,
    HlmErrorDirective,
    HlmToasterComponent
  ],
  providers: [
    provideIcons({
      heroUsers,
      featherMoreVertical,
      lucidePlus
    })
  ],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent implements OnInit, OnDestroy {

  @ViewChild('dialog') dialog!: BrnDialogComponent;

  store = inject(Store)
  route = inject(ActivatedRoute)
  subscriptions = new Subscription()
  teamId!: string | null
  team!: Team | undefined;
  formBuilder = inject(FormBuilder);
  actions$ = inject(Actions);
  private destroy$ = new Subject<void>();
  // Email management
  emails: string[] = [];
  currentEmailInput: string = '';

  // Role descriptions
  roleDescriptions = {
    MEMBER: 'Members can view and edit team content',
    ADMIN: 'Admins can manage team settings and members',
    OWNER: 'Owners have full control over the team'
  };

  memberForm = this.formBuilder.group({
    email: new FormControl('', email()),
    role: new FormControl('MEMBER', Validators.required),
  });

  ngOnInit(): void {

    this.actions$.pipe(
      ofType(InviteMultipleSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
        action.res.forEach(res => {
          toast.success('Invite has been sent', {
            description: `${res}`
          });
        });
    });

    // Handle error actions
    this.actions$.pipe(
      ofType(CreateSpaceFailure),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.error('Failed to create space', {
        description: action.error?.message || 'An error occurred while saving the document'
      });
    });


    this.subscriptions.add(
      this.route.paramMap.pipe(take(1)).subscribe(params => {
        this.teamId = params.get('id');

        if (!this.teamId || this.teamId === 'new') return;

        this.subscriptions.add(
          this.store.select(selectTeam(this.teamId)).subscribe(team => {
            this.team = team;
          })
        );
      })
    );

    // Watch role changes to update description
    this.subscriptions.add(
      this.memberForm.get('role')?.valueChanges.subscribe(role => {
        // Role description will be handled in template
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  // Email input handling
  onEmailKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addEmail();
    }
  }

  onEmailBlur(): void {
    this.addEmail();
  }

  addEmail(): void {
    const emailControl = this.memberForm.get('email');
    const email = emailControl?.value?.trim();

    if (email && this.isValidEmail(email) && !this.emails.includes(email)) {
      this.emails.push(email);
      emailControl?.setValue('');
      emailControl?.markAsUntouched();
    }
  }

  removeEmail(emailToRemove: string): void {
    this.emails = this.emails.filter(email => email !== emailToRemove);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get canSendInvites(): boolean {
    return this.emails.length > 0 && this.memberForm.get('role')?.valid === true;
  }

  get currentRoleDescription(): string {
    const role = this.memberForm.get('role')?.value as keyof typeof this.roleDescriptions;
    return this.roleDescriptions[role] || '';
  }

  inviteMember(): void {
    if (!this.canSendInvites || !this.teamId) {
      return;
    }

    const multipleTeamInviteRequest: MultipleTeamInviteRequest = {
      emails: [...this.emails],
      role: this.memberForm.get('role')?.value || 'MEMBER',
      teamId: this.teamId
    };

    console.log('Sending invites:', multipleTeamInviteRequest);

    this.store.dispatch(InviteMultiple({multipleTeamInviteRequest: multipleTeamInviteRequest}));
    this.resetForm();
  }

  closeModal(): void {
    this.dialog.close({});
    this.resetForm();
  }

  private resetForm(): void {
    this.emails = [];
    this.memberForm.reset({
      email: '',
      role: 'MEMBER'
    });
  }

  viewSpace(space: string) {
    this.store.dispatch(Navigate({path: ['home', 'space', space]}))
  }

}
