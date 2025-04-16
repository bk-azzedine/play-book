import {createAction, props} from '@ngrx/store';

export enum RouterActionTypes {
  Navigate = '[Router] Navigate'
}

export const Navigate = createAction(
  RouterActionTypes.Navigate,
  props<{path: string}>()
);
