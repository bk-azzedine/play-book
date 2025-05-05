import {Space} from './Space.model';


export interface Team {
  id?: string;
  name: string;
  companyId: string;
  spaces: Space[] | null;
}
