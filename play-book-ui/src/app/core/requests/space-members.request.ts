import {SpaceVisibilityEnum} from '../../store/models/enums/space-visibility.enum';
import {SpaceMember} from '../../store/models/space-members.model';
import {User} from '../../store/models/user.model';
import {SpacePrivilegesEnum} from '../../store/models/enums/space-privilges.enum';

export interface SpaceMembersRequest {
   member: User
   privilege: SpacePrivilegesEnum

}
