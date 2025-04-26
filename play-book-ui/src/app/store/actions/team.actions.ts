import {createAction, props} from '@ngrx/store';
import {Company} from '../models/company.model';
import {CompanyActionTypes} from './company.actions';
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
  TeamActionTypes.Create,
  props<{ team: Team }>()
);
export const CreateSuccess = createAction(
  TeamActionTypes.CreateSuccess,
  props<{ team: Team }>()
);
export const CreateFailure = createAction(
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



