import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {

  private ongoingRequest = new BehaviorSubject<number>(0);

  public isLoading(): Observable<boolean> {
    return this.ongoingRequest.asObservable()
      .pipe(map(ongoingRequests => ongoingRequests > 0));
  }

  public addRequest(): void {
    this.ongoingRequest.next(this.ongoingRequest.value + 1);
  }

  public removeRequest(): void {
    this.ongoingRequest.next(this.ongoingRequest.value - 1);
  }
}
