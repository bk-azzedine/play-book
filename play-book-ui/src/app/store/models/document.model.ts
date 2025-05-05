import {User} from './user.model';

export interface Document {
  id: string,
  title: string,
  description: string,
  space: string,
  organization: string,
  authors: User[],
  tags: string[],
  lastUpdated: string,
  createdAt: string
}
