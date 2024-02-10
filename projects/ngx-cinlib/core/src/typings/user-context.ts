import { Maybe } from './maybe';
import { User } from './user';
import { UserContextMedia } from './user-context-media';

//TODO: Remove UserContext and put profile picture, etc. to User
export type UserContext = {
  user?: Maybe<User>,
  uploads?: Maybe<Maybe<UserContextMedia>[]>
}