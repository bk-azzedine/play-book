import {Space} from './Space.model';
import {TeamMember} from './team-members.model';


export interface Team {
  id?: string;
  name: string;
  companyId: string;
  spaces: Space[] | null;
  members: TeamMember[] | null;
}
