import {CompanyState} from './company.state';
import {AuthState} from './auth.state';
import {DocumentState} from './document.state';

export interface AppState {
  company: CompanyState;
  auth: AuthState ;
  documents: DocumentState ;
}
