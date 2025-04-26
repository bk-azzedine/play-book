export interface Document {
  id: string,
  title: string,
  description: string,
  user: {
    initials: string,
    name: string,
    avatarColor: string
  },
  tags: string[],
  lastUpdated: string,
  createdAt: string
}
