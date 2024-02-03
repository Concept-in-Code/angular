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

  public open(content: SidenavContent) {
    this.component.next(content)
  }

  public close(): void {
    this.component.next(undefined);
  }
  
}
