import {SpaceMember} from './space-members.model';

export interface Space {
  spaceId: string;
  name: string;
  teamId: string;
  description: string;
  icon: string;
  members: SpaceMember[]

}
