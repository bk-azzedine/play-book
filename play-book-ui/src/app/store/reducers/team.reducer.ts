import {createReducer, on} from '@ngrx/store';


import { TeamsState} from '../states/team/team.state';
import {CreateSuccess} from '../actions/team.actions';



export const initialTeamsState: TeamsState = {
  teams: []
};

export const teamReducer = createReducer(
  initialTeamsState,
  on(CreateSuccess, (state, action) => {
    return {
      ...state,
      teams: [...state.teams, action.team]
    };
  })
);

