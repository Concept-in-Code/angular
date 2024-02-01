import { Injectable } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CaptchaService {

  private _siteKey = new BehaviorSubject<Maybe<string>>(undefined);

  public siteKey(): Observable<Maybe<string>> {
    return this._siteKey.asObservable();
  }

  public addSiteKey(siteKey: string) {
    this._siteKey.next(siteKey);
  }
}
