import {createAction, props} from '@ngrx/store';
import {Company} from '../models/company.model';

export enum CompanyActionTypes {
  Register = '[Company] Register',
  RegisterSuccess = '[Company] Register Success',
  RegisterFailure = '[Company] Register Failure'
}

export const RegisterCompany = createAction(
  CompanyActionTypes.Register,
  props<{ company: Company }>()
);
export const RegisterSuccess = createAction(
  CompanyActionTypes.RegisterSuccess,
  props<{ company: Company }>()
);
export const RegisterFailure = createAction(
  CompanyActionTypes.RegisterFailure,
  props<{ error: any }>()
);

