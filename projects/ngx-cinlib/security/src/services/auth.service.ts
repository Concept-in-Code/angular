import { Inject, Injectable, Injector } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CIN_AUTH_TOKENS } from '../constants/inject-tokens';
import { refreshKey } from '../constants/refresh';
import { Token } from '../typings/token';
import { RawTokens } from '../typings/tokens';
import { LoginGQL, LoginMutation } from './login.service';
import { RefreshGQL, RefreshMutation } from './refresh.service';

@Injectable({
  providedIn: 'root'
 })
export class AuthService {

  private clearPerformed = new BehaviorSubject<boolean>(false);

  public rawTokens?: Maybe<RawTokens>;

  public get privileges(): Maybe<string[]> {
    return this.rawTokens?.access
      ? (JSON.parse(
            window.atob(this.rawTokens.access.split('.')[1])
          ) as Token)?.privileges
      : undefined;
  }

  public get roles(): Maybe<string[]> {
    return this.rawTokens?.access
      ? (JSON.parse(
            window.atob(this.rawTokens.access.split('.')[1])
          ) as Token)?.privileges
      : undefined;
  }

  constructor(
    private readonly injector: Injector,
    @Inject(CIN_AUTH_TOKENS)
    public initTokens: RawTokens,
  ) {
    this.rawTokens = { ...initTokens };

    // if (!this.tokens.refresh) {
    //   this.clearPerformed.next(true);
    // }
  }

  public cleared(): Observable<boolean> {
    return this.clearPerformed.asObservable();
  }

  public hasAnyPrivileges<T extends string>(privileges: T[]): boolean {
    return privileges.some(privilege =>
      this.roles?.includes(privilege) || this.roles?.includes('admin')
    );
  }

  public hasAnyRoles<T extends string>(roles: T[]): boolean {
    return roles.some(privilege =>
      this.roles?.includes(privilege) || this.roles?.includes('admin')
    );
  }

  public refresh(): Observable<RawTokens> {
    const token = this.rawTokens?.refresh;
    if (token) {
      return this.callRefresh(token);
    }

    const tokenStr = localStorage.getItem(refreshKey);
    if (tokenStr) {
      const refreshToken: Token = JSON.parse(
        window.atob(tokenStr.split('.')[1])
      );

      if (!this.expired(refreshToken.exp)) {
        return this.callRefresh(tokenStr)
      }
    }

    this.clear();
    return EMPTY;
  }

  private callRefresh(refreshToken: string): Observable<RawTokens> {
    return this.injector.get<RefreshGQL>(RefreshGQL).mutate({ refreshToken }).pipe(
      map((response: FetchResult<RefreshMutation>) => response.data?.refreshToken as RawTokens),
      tap((tokens: RawTokens) => this.storeTokens(tokens)),
    );
  }

  private expired(exp: number | undefined): boolean {
    return !!(!exp || (exp * 1000 - Date.now()) < 0);
  }

  public refreshExpired(): void {
    this.clear();
  }

  public login(email: string, password: string): Observable<RawTokens> {
    return this.injector.get<LoginGQL>(LoginGQL).mutate({ email, password }).pipe(
      map((response: FetchResult<LoginMutation>) => response.data?.createToken as RawTokens),
      filter(tokens => !!tokens),
      tap((tokens: RawTokens) => this.storeTokens(tokens)),
    );
  }

  private storeTokens(tokens: RawTokens): void {
    this.rawTokens = tokens;

    tokens.refresh
      && localStorage.setItem(refreshKey, tokens.refresh)
  }

  public clear(): void {
    this.rawTokens = undefined;
    localStorage.removeItem(refreshKey);
    this.clearPerformed.next(true);

  }

}
