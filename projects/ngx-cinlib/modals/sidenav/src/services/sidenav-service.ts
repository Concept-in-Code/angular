import { Injectable } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SidenavContent } from '../typings/sidenav';

@Injectable({ providedIn: 'root' })
export class SidenavService {

  private component = new BehaviorSubject<Maybe<SidenavContent>>(undefined);

  public toggled(): Observable<Maybe<SidenavContent>> {
    return this.component.asObservable();
  }

  public open(sidenav: SidenavContent) {
    this.component.next(sidenav);
  }

  public close(): void {
    this.component.next(undefined);
  }
  
}
