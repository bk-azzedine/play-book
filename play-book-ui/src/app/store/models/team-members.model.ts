import {TeamRoleEnum} from './enums/team-role.enum';
import {User} from './user.model';

export interface TeamMember {
  id: string,
  teamId: string,
  user: User,
  role: TeamRoleEnum
}
