/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { Observable } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translatable'
})
export class TranslatablePipe implements PipeTransform {

  constructor(
    private translationService: TranslationService,
  ) { }

  public transform(
    v?: any,
    field?: Maybe<string>): Observable<Maybe<string> | undefined> {
    return this.translationService.translatable(v, field);
  }
}
