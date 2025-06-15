import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CompanyState} from '../states/company.state';
import {selectUserId} from './auth.selector';
import {Team} from '../models/team.model';
import {selectSelectedCompany} from './company.selector';
import {TeamRoleEnum} from '../models/enums/team-role.enum';


const selectTeams = createFeatureSelector<CompanyState>('company')

export const selectAllTeams = createSelector(
  selectTeams,
  (state: CompanyState) => state.selectedCompany?.teams
);

export const selectManagedTeams = createSelector(
  selectSelectedCompany,
  selectUserId,
  (company , userId) => {
    if (!userId || !company?.teams) return [];

    return company.teams.filter((team: Team) =>
      team.members?.some(member => member.user.userId === userId && member.role === TeamRoleEnum.OWNER || member.role === TeamRoleEnum.ADMIN)
    );
  }
);
export const selectUserTeams = createSelector(
  selectSelectedCompany,
  selectUserId,
  (company, userId) => {
    if (!userId || !company?.teams) return [];

    return company.teams
      .filter((team: Team) => team != null)
      .filter((team: Team) =>
        team.members?.some(member =>
          member?.user?.userId === userId
        )
      )
      .filter((team: Team) => team !== undefined);
  }
);
export const selectTeam = (teamId: string) => createSelector(
  selectSelectedCompany,
  (selectedCompany) => {
    if (!selectedCompany || !selectedCompany.teams) {
      return ;
    }
    const team = selectedCompany.teams.find(t => t.teamId === teamId);
    return team;
  }
);


