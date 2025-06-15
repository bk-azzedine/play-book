import {SpaceVisibilityEnum} from '../../store/models/enums/space-visibility.enum';

import {SpaceMembersRequest} from './space-members.request';
import {SpaceMember} from '../../store/models/space-members.model';

export interface SpaceUpdateRequest {
  space_id: string;
  name: string;
  teamId: string;
  description: string;
  icon: string;
  members: SpaceMember[]
  visibility: SpaceVisibilityEnum


}
