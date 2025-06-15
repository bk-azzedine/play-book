import {Company} from '../models/company.model';
import {Document} from '../models/document.model';
export interface CompanyState {
  selectedCompany: Company | null;
  companies: Company[];
  loading: boolean;
  error: string | null;
}
