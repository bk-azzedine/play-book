import {SpaceVisibilityEnum} from '../../store/models/enums/space-visibility.enum';

import {SpaceMembersRequest} from './space-members.request';

export interface SpaceRequest {
  name: string;
  description: string;
 icon: string;
 team_id: string;
 members: SpaceMembersRequest[];
 visibility: SpaceVisibilityEnum;

}
