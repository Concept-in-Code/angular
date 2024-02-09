/* eslint-disable */

import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
import { gql } from 'apollo-angular';

export type RefreshMutationVariables = {
  refreshToken: string;
};

export type RefreshMutation = { __typename?: 'Mutation', refreshToken?: { access?: string | null, refresh?: string | null } | null };

export const RefreshDocument = gql`
  mutation refresh($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      access
      refresh
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class RefreshGQL extends Apollo.Mutation<RefreshMutation, RefreshMutationVariables> {
  override document = RefreshDocument;
  
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}