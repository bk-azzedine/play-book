import {createAction, props} from '@ngrx/store';

import {Team} from '../models/team.model';
import {TeamInviteRequest} from '../../core/requests/team-invite.request';

export enum TeamActionTypes {
  Create = '[Team] Create',
  CreateSuccess = '[Team] Create Success',
  CreateFailure = '[Team] Create Failure',
  Invite = '[Team] Invite',
  InviteSuccess = '[Team] Invite Success',
  InviteFailure = '[Team] Invite Failure',
}


export const CreateTeam = createAction(
  '[Team] Create Team',
  props<{ team: Partial<Team>, companyId: string }>()
);

export const CreateTeamSuccess = createAction(
  '[Team] Create Team Success',
  props<{ team: Team, companyId: string }>()
);

export const CreateTeamFailure = createAction(
  '[Team] Create Team Failure',
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



