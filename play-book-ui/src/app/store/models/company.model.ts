import {Team} from './team.model';
import {User} from './user.model';

export interface Company {
  organizationId?: string;
  owner?: User;
  name: string;
  field: string;
  teams: Team[] | null;
  initial: string | undefined;
  color : string | undefined;
}
