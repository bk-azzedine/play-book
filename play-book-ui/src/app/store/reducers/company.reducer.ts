import {createReducer, on} from '@ngrx/store';
import {
  RegisterSuccess,
  LoadCompaniesSuccess, SelectCompany, LoadSelectedCompanySuccess
} from '../actions/company.actions';
import {
  CreateTeamSuccess
} from '../actions/team.actions';

import {CompanyState} from '../states/company.state';
import {CreateSpaceSuccess, DeleteSpaceSuccess, UpdateSpaceSuccess} from '../actions/space.actions';

export const initialCompanyState: CompanyState = {
  selectedCompany: null,
  companies: [],
  loading: false,
  error: null

};

export const companyReducer = createReducer(
  initialCompanyState,

  on(RegisterSuccess, (state, {company}) => {
    return {
      ...state,
      selectedCompany: company,
      companies: [...state.companies, company],
      loading: false,
      error: null
    };
  }),

  on(LoadCompaniesSuccess, (state, {companies}) => {
    return {
      ...state,
      companies,
      loading: false,
      error: null
    };
  }),

  on(SelectCompany,LoadSelectedCompanySuccess, (state, {selectedCompany}) => ({
    ...state,
    selectedCompany
  })),

  on(CreateTeamSuccess, (state, {team, companyId}) => {
    let updatedSelectedCompany;
    if (state.selectedCompany && state.selectedCompany.organizationId === companyId) {
      const updatedTeams = state.selectedCompany.teams
        ? [...state.selectedCompany.teams, team]
        : [team];

      updatedSelectedCompany = {
        ...state.selectedCompany,
        teams: updatedTeams
      };
    } else {
      updatedSelectedCompany = state.selectedCompany;
    }

    const updatedCompanies = state.companies.map(company => {
      if (company.organizationId === companyId) {
        return {
          ...company,
          teams: company.teams ? [...company.teams, team] : [team]
        }
      }
      return company;
    });

    return {
      ...state,
      selectedCompany: updatedSelectedCompany,
      companies: updatedCompanies
    };
  }),
  on(CreateSpaceSuccess, UpdateSpaceSuccess, (state, {space}) => {
    // Ensure selectedCompany exists and has a teams array to avoid errors
    if (!state.selectedCompany || !state.selectedCompany.teams) {
      console.warn("CreateSpaceSuccess: selectedCompany or its teams array is null/undefined. Cannot add space.");
      return state; // Return current state if prerequisites are missing
    }

    // 1. Immutably update the selectedCompany
    const updatedSelectedCompany = {
      ...state.selectedCompany,
      // Update the teams array within the selected company
      teams: state.selectedCompany.teams.map(team => {
        // Find the specific team by matching the teamId from the action payload
        if (team.teamId === space.teamId) {
          // Return a *new* team object with the new space added to its spaces array
          return {
            ...team,
            // Ensure spaces array exists before spreading
            spaces: team.spaces ? [...team.spaces, space] : [space]
          };
        }
        // Return other teams in this company unchanged
        return team;
      })
    };

    // 2. Update the companies array by replacing the old selected company
    // with the new, updated selectedCompany object to keep the state consistent
    const updatedCompanies = state.companies.map(company => {
      if (company.organizationId === updatedSelectedCompany.organizationId) {
        // Replace the old company object with the new updated one
        return updatedSelectedCompany;
      }
      // Keep other companies unchanged
      return company;
    });

    // 3. Return the new state object
    return {
      ...state,
      companies: updatedCompanies,
      // Update selectedCompany in the state to be the new updated object reference
      selectedCompany: updatedSelectedCompany
    };
  }),
  on(DeleteSpaceSuccess, (state, {res, id}) => {
    // Ensure selectedCompany exists and has a teams array to avoid errors
    if (!state.selectedCompany || !state.selectedCompany.teams) {
      console.warn("DeleteSpaceSuccess: selectedCompany or its teams array is null/undefined. Cannot delete space.");
      return state; // Return current state if prerequisites are missing
    }

    // 1. Immutably update the selectedCompany
    const updatedSelectedCompany = {
      ...state.selectedCompany,
      // Update the teams array within the selected company
      teams: state.selectedCompany.teams.map(team => {
        // Check if this team has spaces and if any of them match the id to delete
        if (team.spaces && team.spaces.some(space => space.spaceId === id)) {
          // Return a *new* team object with the space removed from its spaces array
          return {
            ...team,
            spaces: team.spaces.filter(space => space.spaceId !== id)
          };
        }
        // Return other teams unchanged
        return team;
      })
    };

    // 2. Update the companies array by replacing the old selected company
    // with the new, updated selectedCompany object to keep the state consistent
    const updatedCompanies = state.companies.map(company => {
      if (company.organizationId === updatedSelectedCompany.organizationId) {
        // Replace the old company object with the new updated one
        return updatedSelectedCompany;
      }
      // Keep other companies unchanged
      return company;
    });

    // 3. Return the new state object
    return {
      ...state,
      companies: updatedCompanies,
      // Update selectedCompany in the state to be the new updated object reference
      selectedCompany: updatedSelectedCompany
    };
  })
);


