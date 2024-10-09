import { InjectionToken } from '@angular/core';
import { RawTokens } from '../typings/tokens';

export const CIN_AUTH_TOKENS = new InjectionToken<RawTokens>('cin-auth-tokens');
