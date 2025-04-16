export interface payload{
  activated : boolean
  sub: string
  exp: number
  iat: number
  organizations: any[]
  teams: any[],
  spaces: any[]
}
