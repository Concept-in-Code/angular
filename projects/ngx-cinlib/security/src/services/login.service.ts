import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';

export type LoginMutationVariables = {
  email: string;
  password: string;
};

export type LoginMutation = { __typename?: 'Mutation', createToken?: { access?: string | null, refresh?: string | null } | null };

export const LoginDocument = gql`
  mutation login($email: String!, $password: String!) {
    createToken(email: $email, password: $password) {
      access
      refresh
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
  override document = LoginDocument;
  
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}