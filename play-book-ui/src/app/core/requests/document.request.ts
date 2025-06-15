

export interface DocumentRequestBlock {
  type: string,
  data: { [key: string]: any }
}
export interface DocumentRequestContent {
  time?: number,
  blocks: DocumentRequestBlock[],
  version?: string,
}

export interface DocumentRequest {
  id: string | null,
  title: string,
  description: string,
  space: string,
  organization: string,
  authors: string[],
  draft: boolean,
  favorite: boolean,
  content: DocumentRequestContent| null,
  tags: string[],
  lastUpdated: string,
  createdAt: string
}
