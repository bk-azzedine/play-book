import {User} from './user.model';


export interface Block {
  type: string,
  data: { [key: string]: any }
}
export interface Content {
  time?: number,
  blocks: Block[],
  version?: string,
}

export interface Document {
  id: string,
  title: string,
  description: string,
  space: string,
  organization: string,
  authors: User[],
  content: Content| null,
  tags: string[],
  lastUpdated: string,
  createdAt: string
}
