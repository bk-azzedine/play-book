import {createAction, props} from '@ngrx/store';
import {SpaceRequest} from '../../core/requests/space.request';
import {Space} from '../models/Space.model';
import {SpaceUpdateRequest} from '../../core/requests/space-update.request';

export enum SpaceActionTypes {
  LoadSpace = '[Spaces] Load Spaces',
  LoadSpaceSuccess = '[Spaces] Load Spaces Success',
  LoadSpaceFailure = '[Spaces] Load Spaces Failure',
  CreateSpace = '[Spaces] Create Space',
  CreateSpaceSuccess = '[Spaces] Create Space Success',
  CreateSpaceFailure = '[Spaces] Create Space Failure',
  UpdateSpace = '[Spaces] Update Space',
  UpdateSpaceSuccess = '[Spaces] Update Space Success',
  UpdateSpaceFailure = '[Spaces] Update Space Failure',
  DeleteSpace = '[Spaces] Delete Space',
  DeleteSpaceSuccess = '[Spaces] Delete Space Success',
  DeleteSpaceFailure = '[Spaces] Delete Space Failure'
}

export const CreateSpace = createAction(
  SpaceActionTypes.CreateSpace,
  props<{ space : SpaceRequest }>()
);

export const CreateSpaceSuccess = createAction(
  SpaceActionTypes.CreateSpaceSuccess,
  props<{ space : Space }>()
);
export const CreateSpaceFailure = createAction(
  SpaceActionTypes.CreateSpaceFailure,
  props<{ error : any }>()
);

export const UpdateSpace = createAction(
  SpaceActionTypes.UpdateSpace,
  props<{ space : SpaceUpdateRequest }>()
);

export const UpdateSpaceSuccess = createAction(
  SpaceActionTypes.UpdateSpaceSuccess,
  props<{ space : Space }>()
);
export const UpdateSpaceFailure = createAction(
  SpaceActionTypes.UpdateSpaceFailure,
  props<{ error : any }>()
);

export const DeleteSpace = createAction(
  SpaceActionTypes.DeleteSpace,
  props<{ id : string }>()
);

export const DeleteSpaceSuccess = createAction(
  SpaceActionTypes.DeleteSpaceSuccess,
  props<{ res : string, id: string }>()
);
export const DeleteSpaceFailure = createAction(
  SpaceActionTypes.DeleteSpaceFailure,
  props<{ error : any }>()
);
