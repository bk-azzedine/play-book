import { createReducer, on } from '@ngrx/store';
import {
  RegisterSuccess,
  LoadCompaniesSuccess, SelectCompany
} from '../actions/company.actions';
import {
  CreateTeamSuccess
} from '../actions/team.actions';

import { CompanyState } from '../states/company.state';

export const initialCompanyState: CompanyState = {
  selectedCompany: null,
  companies: [],
  loading: false,
  error: null

};

export const companyReducer = createReducer(
  initialCompanyState,

  on(RegisterSuccess, (state, { company }) => {
    return {
      ...state,
      selectedCompany: company,
      companies: [...state.companies, company],
      loading: false,
      error: null
    };
  }),

  on(LoadCompaniesSuccess, (state, { companies }) => {
    return {
      ...state,
      companies,
      loading: false,
      error: null
    };
  }),

  on(SelectCompany, (state, { selectedCompany }) => ({
    ...state,
    selectedCompany
  })),

  on(CreateTeamSuccess, (state, { team, companyId }) => {
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
  })

);


