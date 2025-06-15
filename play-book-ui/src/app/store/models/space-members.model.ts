import {SpacePrivilegesEnum} from './enums/space-privilges.enum';
import {User} from './user.model';

export interface SpaceMember {
  id: string
  spaceId:string
  user: User
  privilege: SpacePrivilegesEnum
}
