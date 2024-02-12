import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { TranslationService } from './translation.service';

@Injectable({ providedIn: 'root' })
export class LanguageInterceptor implements HttpInterceptor {

  constructor(
    private translatonService: TranslationService,
  ) { }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.translatonService.getCurrentLanguage()
      .pipe(
        take(1),
        switchMap(language => next.handle(
          request.clone({ headers: request.headers.set('Accept-Language', language?.locale as string)})
        )),
      );
  } 
}
