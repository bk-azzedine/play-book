import {createAction, props} from '@ngrx/store';
import {Company} from '../models/company.model';
import {CompanyActionTypes} from './company.actions';
import {Team} from '../models/team.model';

export enum TeamActionTypes {
  Create = '[Team] Create',
  CreateSuccess = '[Team] Create Success',
  CreateFailure = '[Team] Create Failure'
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

