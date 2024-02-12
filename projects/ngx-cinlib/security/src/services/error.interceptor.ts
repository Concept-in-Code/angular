/* eslint-disable no-fallthrough */
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiError, ApiResponse } from 'ngx-cinlib/core';
import { FeedbackService, FeedbackType } from 'ngx-cinlib/modals/feedback';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { accessDeniedError, tokenExpiredError } from '../constants/error';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private feedbackService: FeedbackService,
  ) { }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
        tap((response: HttpEvent<ApiResponse>) => this.handleError(response)),
        catchError((response: HttpErrorResponse) => this.handleCritical(response)),
      );
  }

  private handleError(response: HttpEvent<ApiResponse>): void {
    if (response instanceof HttpResponse 
      && response?.body?.errors?.length
      && response.body?.errors?.every((error: ApiError) => error.extensions.exception !== accessDeniedError)) {

        if (response.body?.errors?.some((error: ApiError)  => error.extensions.exception === tokenExpiredError)) {
          this.authService.refreshExpired();
        }
        
        this.feedbackService.open({
          type: FeedbackType.Error,
          labelMessage: response?.body?.errors[0].message,
          labelAction: 'tryAgain',
        });
    }
  }

  private handleCritical(response: HttpErrorResponse): Observable<never> {
    this.feedbackService.open({
      type: FeedbackType.Critical,
      labelMessage: response?.message,
      labelAction: 'criticalError',
    });
    return EMPTY;
  }

}
