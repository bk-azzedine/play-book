import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {HlmButtonDirective} from '@spartan-ng/ui-button-helm';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {
  CreateTeamFailure,
  CreateTeamSuccess,
  DeclineInvite, DeclineInviteFailure,
  DeclineInviteSuccess
} from '../../store/actions/team.actions';
import {HlmToasterComponent} from '@spartan-ng/ui-sonner-helm';
import {Subject, takeUntil} from 'rxjs';
import {Actions, ofType} from '@ngrx/effects';
import {toast} from 'ngx-sonner';
import {Navigate} from '../../store/actions/router.actions';

@Component({
  selector: 'app-invite',
  imports: [
    NgIf,
    NgForOf,
    HlmToasterComponent
  ],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.css'
})
export class InviteComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  store = inject(Store);
  private destroy$ = new Subject<void>();
  actions$ = inject(Actions);

  inviteData = {
    token: '',
    teamName: '',
    orgName: '',
    teamDescription: '',
    role: 'Member'
  };

  isAccepting = false;
  isDeclining = false;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.actions$.pipe(
      ofType(DeclineInviteSuccess),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      this.isDeclining = false
      toast.success('Invite Has been decline', {
        description: `invite to join ${this.inviteData.teamName} was declined`
      });
    });

    // Handle error actions
    this.actions$.pipe(
      ofType(DeclineInviteFailure),
      takeUntil(this.destroy$)
    ).subscribe(action => {
      toast.error('Failed to decline invite', {
        description: action.error?.message || 'An error occurred while declining the invite'
      });
    });
    this.loadInviteData();
  }

  private loadInviteData(): void {
    this.route.queryParams.subscribe(params => {
      this.inviteData = {
        token: decodeURIComponent(params['token'] || ''),
        teamName: decodeURIComponent(params['teamName'] || ''),
        orgName: decodeURIComponent(params['orgName'] || ''),
        teamDescription: decodeURIComponent(params['teamDescription'] || ''),
        role: decodeURIComponent(params['role'] || 'Member')
      };

      // Validate that we have the required token
      if (!this.inviteData.token) {
        this.error = 'Invalid invitation link';
        this.isLoading = false;
        return;
      }

      // Since we have all the data from URL params, we can stop loading
      // If you want to fetch additional data from API later, implement fetchInviteDetails()
      this.isLoading = false;

      console.log('Invite data loaded:', this.inviteData);
    });
  }



  acceptInvitation(): void {
    if (this.isAccepting || this.isDeclining) return;

    this.isAccepting = true;
    this.error = null;
    this.store.dispatch(Navigate({path: ['signup', this.inviteData.token]}))
  }

  declineInvitation(): void {
    if (this.isAccepting || this.isDeclining) return;

    this.isDeclining = true;
    this.error = null;
    this.store.dispatch(DeclineInvite({inviteId: this.inviteData.token}))
  }

  getRolePermissions(): string[] {
    const permissions = {
      'ADMIN': [
        'Full team management access',
        'Add and remove team members',
        'Manage team settings and permissions',
        'View and edit all team content'
      ],
      'OWNER': [
        'Full ownership of the team',
        'Complete administrative control',
        'Manage all team members and roles',
        'Delete or transfer team ownership'
      ],
      'MEMBER': [
        'View and edit team content',
        'Participate in team discussions',
        'Access team resources and files'
      ],
      'VIEWER': [
        'View team content',
        'Access team resources',
        'Participate in discussions'
      ]
    };

    // Handle both uppercase and lowercase role names
    const roleKey = this.inviteData.role.toUpperCase() as keyof typeof permissions;
    return permissions[roleKey] || permissions['MEMBER'];
  }
}
