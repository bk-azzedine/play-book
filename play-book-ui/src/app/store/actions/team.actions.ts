import {createAction, props} from '@ngrx/store';

import {Team} from '../models/team.model';
import {TeamInviteRequest} from '../../core/requests/team-invite.request';
import {User} from '../models/user.model';
import {MultipleTeamInviteRequest} from '../../core/requests/multiple-team-invite.request';

export enum TeamActionTypes {
  Create = '[Team] Create',
  CreateSuccess = '[Team] Create Success',
  CreateFailure = '[Team] Create Failure',
  Invite = '[Team] Invite',
  InviteSuccess = '[Team] Invite Success',
  InviteFailure = '[Team] Invite Failure',
  GetTeamMembers = '[Team] Get Team Members',
  GetTeamMembersSuccess = '[Team] Get Team Members Success',
  GetTeamMembersFailure = '[Team] Get Team Members Failure',
  InviteMultiple = '[Team] Invite Multiple',
  InviteMultipleSuccess = '[Team] Invite Multiple Success',
  InviteMultipleFailure = '[Team] Invite Multiple Failure',
  DeclineInvite = '[Team] Decline Invite',
  DeclineInviteSuccess = '[Team] Decline Invite Success',
  DeclineInviteFailure = '[Team] Decline Invite Failure',
}


export const CreateTeam = createAction(
  TeamActionTypes.Create,
  props<{ team: Partial<Team>, companyId: string }>()
);

export const CreateTeamSuccess = createAction(
  TeamActionTypes.CreateSuccess,
  props<{ team: Team, companyId: string }>()
);

export const CreateTeamFailure = createAction(
  TeamActionTypes.CreateFailure,
  props<{ error: any }>()
);

export const Invite = createAction(
  TeamActionTypes.Invite,
  props<{ teamInvite: TeamInviteRequest }>()
);
export const InviteSuccess = createAction(
  TeamActionTypes.InviteSuccess,
  props<{ res: String }>()
);
export const InviteFailure = createAction(
  TeamActionTypes.InviteFailure,
  props<{ error: any }>()
);

export const GetTeamMembers = createAction(
  TeamActionTypes.GetTeamMembers,
  props<{ userIds: string[] }>()
);

export const GetTeamMembersSuccess = createAction(
  TeamActionTypes.GetTeamMembersSuccess,
  props<{ members: User[] }>()
);
export const GetTeamMembersFailure = createAction(
  TeamActionTypes.GetTeamMembersFailure,
  props<{ error: any }>()
);

export const InviteMultiple = createAction(
  TeamActionTypes.InviteMultiple,
  props<{ multipleTeamInviteRequest: MultipleTeamInviteRequest}>()
)
export const InviteMultipleSuccess = createAction(
  TeamActionTypes.InviteMultipleSuccess,
  props<{ res : string[]}>()
)
export const InviteMultipleFailure = createAction(
  TeamActionTypes.InviteMultipleFailure,
  props<{ error: any }>()
);
export const DeclineInvite = createAction(
  TeamActionTypes.DeclineInvite,
  props<{ inviteId: string }>()
);
export const DeclineInviteSuccess = createAction(
  TeamActionTypes.DeclineInviteSuccess,
  props<{ res: String }>()
);
export const DeclineInviteFailure = createAction(
  TeamActionTypes.DeclineInviteFailure,
  props<{ error: any }>()
);
