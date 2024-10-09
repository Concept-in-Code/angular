
export interface Token {
  exp: number,
  id: string,
  privileges: Array<string>,
  roles: Array<string>,
  scopes: Array<string>,
  sub: string,
  verified?: boolean,
}
