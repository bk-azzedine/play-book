import {Team} from './team.model';

export interface Company {
  organizationId?: string;
  ownerId?: string;
  name: string;
  field: string;
  teams: Team[] | null;
  initial: string | undefined;
  color : string | undefined;
}
