import {Company} from '../states/company/company.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Team} from '../models/team.model';
import {TeamsState} from '../states/team/team.state';

const selectTeams = createFeatureSelector<TeamsState>('team')

export const selectAllTeams = createSelector(
  selectTeams,
  (state: TeamsState) => state.teams
);


