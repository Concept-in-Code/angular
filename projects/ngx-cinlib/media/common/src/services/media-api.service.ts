import { Injectable } from '@angular/core';
import { Maybe, Media } from 'ngx-cinlib/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaApiService {

  private mediaBaseApi = new BehaviorSubject<Maybe<string>>(undefined);

  private mediaDownloadBaseApi = new BehaviorSubject<Maybe<string>>(undefined);

  private mediaMimeTypeApi = new BehaviorSubject<Maybe<string>>(undefined);

  public getMediaBaseApi(): Observable<Maybe<string>> {
    return this.mediaBaseApi.asObservable();
  }

  public setMediaBaseApi(api: string) {
    this.mediaBaseApi.next(api);
  }

  public getMediaDownloadBaseApi(): Observable<Maybe<string>> {
    return this.mediaDownloadBaseApi.asObservable();
  }

  public setMediaDownloadBaseApi(api: string) {
    this.mediaDownloadBaseApi.next(api);
  }

  public createDownloadApi(media: Maybe<Media>): Observable<string> {
    return this.getMediaDownloadBaseApi()
      .pipe(
        filter(baseApi => !!baseApi && !!media),
        map(baseApi => `${baseApi}/${media?.id}`)
      );
  }

  public getMediaMimeTypeApi(): Observable<Maybe<string>> {
    return this.mediaMimeTypeApi.asObservable();
  }

  public setMediaMimeTypeApi(api: string) {
    this.mediaMimeTypeApi.next(api);
  }
}

