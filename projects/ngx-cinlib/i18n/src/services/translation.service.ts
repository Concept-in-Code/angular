/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { BehaviorSubject, Observable, combineLatest, filter, isObservable, map, of } from 'rxjs';
import { languageLocalStorage } from '../constants/i18n.constants';
import { Language } from '../typings/language';
import { Translatable } from '../typings/translatable';

@Injectable({ providedIn: 'root' })
export class TranslationService {

  private labels = new BehaviorSubject<Map<string, Maybe<Translatable>[]>>(new Map());

  private currentLanguage = new BehaviorSubject<Maybe<Language>>({ locale:
      localStorage.getItem(languageLocalStorage)
        ? localStorage.getItem(languageLocalStorage)
        : 'de'
  });

  private defaultLocale = new BehaviorSubject<string>('de');

  public setLabels(labels: Map<string, Maybe<Translatable>[]>): void {
    this.labels.next(labels);
  }

  public getLabel(
    key?: Maybe<string>
  ): Observable<Maybe<string>> {
    return key
      ? combineLatest([
        this.labels.asObservable(),
        this.currentLanguage.asObservable(),
        this.defaultLocale.asObservable()
      ]).pipe(
        filter(([labels]) => !!labels),
        map(([labels, language, defaultLocale]) => {
          const label = labels?.get(key)?.find(label => label?.language?.locale === language?.locale);
          return label ?? labels?.get(key)?.find(label => label?.language?.locale === defaultLocale)
        }),
        map(label => label ? label['content'] as string : key)
      )
      : of(key);
  }

  public getCurrentLanguage(): Observable<Maybe<Language>> {
    return this.currentLanguage.asObservable();
  }

  public setCurrentLanguage(language: Maybe<Language>) {
    this.currentLanguage.next(language);
  }

  public translatable(
    v?: any,
    field?: Maybe<string>
  ): Observable<Maybe<string> | undefined> {
      
    return combineLatest([
      isObservable(v) ? v : of(v),
      this.currentLanguage.asObservable(),
      this.defaultLocale.asObservable()
    ]).pipe(
      map(([value, language, defaultLocale]) => (Array.isArray(value) 
        ? [value, language, defaultLocale]
        : [(value as any)?.translatables, language, defaultLocale]) as [Maybe<Translatable[]>, Language, string]),
      map(([translatables, language, defaultLocale]) => {
        const translatable = translatables?.find(t => t?.language?.locale === language?.locale);
        return translatable ?? translatables?.find(t => t?.language?.locale === defaultLocale);
      }),
      map(translatable => (translatable && field ? translatable[field] : '') as string),
    );
  }

}
