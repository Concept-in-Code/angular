export interface Token {
  exp: number,
  id: string,
  privileges: Array<string>,
  scopes: Array<string>,
  sub: string,
  verified?: boolean, 
}