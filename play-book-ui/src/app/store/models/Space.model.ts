import {SpaceMember} from './space-members.model';
import {SpaceVisibilityEnum} from './enums/space-visibility.enum';

export interface Space {
  spaceId: string;
  name: string;
  teamId: string;
  description: string;
  icon: string;
  members: SpaceMember[]
  visibility: SpaceVisibilityEnum

}
