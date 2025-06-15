import {Space} from './Space.model';
import {TeamMember} from './team-members.model';


export interface Team {
  teamId: string;
  name: string;
  description: string;
  companyId: string;
  spaces: Space[] | null;

  members: TeamMember[] | null;
}
