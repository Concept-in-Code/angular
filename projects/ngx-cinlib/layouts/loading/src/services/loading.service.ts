import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private ongoingRequest = new BehaviorSubject<number>(0);

  private changes(): Observable<number> {
    return this.ongoingRequest.asObservable();
  }

  public isLoading(): Observable<boolean> {
    return this.changes()
      .pipe(map(ongoingRequests => ongoingRequests > 0));
  }

  public addRequest(): void {
    this.changes()
      .pipe(take(1))
      .subscribe(count => this.ongoingRequest.next(count + 1));
  }

  public removeRequest(): void {
    this.changes()
      .pipe(take(1))
      .subscribe(count => this.ongoingRequest.next(count - 1));
  }
}
