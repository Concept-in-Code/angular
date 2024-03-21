/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { Observable } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Pipe({
  name: 'translatable',
  standalone: true,
})
export class TranslatablePipe implements PipeTransform {

  constructor(
    private translationService: TranslationService,
  ) { }

  public transform(
    value?: any,
    field?: Maybe<string>): Observable<Maybe<string> | undefined> {
    return this.translationService.watchTranslatable(value, field);
  }
}
