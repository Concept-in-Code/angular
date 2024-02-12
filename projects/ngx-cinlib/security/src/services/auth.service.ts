import { Inject, Injectable, Injector } from '@angular/core';
import { FetchResult } from '@apollo/client/core';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { CIN_AUTH_TOKENS } from '../constants/inject-tokens';
import { refreshKey } from '../constants/refresh';
import { Token } from '../typings/token';
import { Tokens } from '../typings/tokens';
import { LoginGQL, LoginMutation } from './login.service';
import { RefreshGQL, RefreshMutation } from './refresh.service';

@Injectable({ 
  providedIn: 'root'
 })
export class AuthService {

  public tokens?: Maybe<Tokens>;

  private clearPerformed = new BehaviorSubject<boolean>(false);

  public get userPrivileges(): Maybe<string[]> {
    return this.tokens?.access
      ? (JSON.parse(
            window.atob(this.tokens.access.split('.')[1])
          ) as Token)?.privileges
      : undefined;
  }

  constructor(
    private readonly injector: Injector,
    @Inject(CIN_AUTH_TOKENS)
    public initTokens: Tokens,
  ) {
    this.tokens = { ...initTokens };

    // if (!this.tokens.refresh) {
    //   this.clearPerformed.next(true);
    // }
  }

  public cleared(): Observable<boolean> {
    return this.clearPerformed.asObservable();
  }

  public hasAnyPrivileges<T>(privileges: T[]): boolean {
    return (privileges as string[]).some(privilege =>
      this.userPrivileges?.includes(privilege) || this.userPrivileges?.includes('admin')
    );
  }

  public refresh(): Observable<Tokens> {
    const token = this.tokens?.refresh;
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

  private callRefresh(refreshToken: string): Observable<Tokens> {
    return this.injector.get<RefreshGQL>(RefreshGQL).mutate({ refreshToken }).pipe(
      map((response: FetchResult<RefreshMutation>) => response.data?.refreshToken as Tokens),
      tap((tokens: Tokens) => this.storeTokens(tokens)),
    );
  }

  private expired(exp: number | undefined): boolean {
    return !!(!exp || (exp * 1000 - Date.now()) < 0);
  }

  public refreshExpired(): void {
    this.clear();
  }

  public login(email: string, password: string): Observable<Tokens> {
    return this.injector.get<LoginGQL>(LoginGQL).mutate({ email, password }).pipe(
      map((response: FetchResult<LoginMutation>) => response.data?.createToken as Tokens),
      filter(tokens => !!tokens),
      tap((tokens: Tokens) => this.storeTokens(tokens)),
    );
  }

  private storeTokens(tokens: Tokens): void {
    this.tokens = tokens;

    tokens.refresh
      && localStorage.setItem(refreshKey, tokens.refresh)
  }

  public clear(): void {
    this.tokens = undefined;
    localStorage.removeItem(refreshKey);
    this.clearPerformed.next(true);
    
  }

}
