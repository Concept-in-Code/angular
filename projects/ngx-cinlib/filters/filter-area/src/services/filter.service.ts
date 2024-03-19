import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Maybe } from 'ngx-cinlib/core';
import { Observable, filter, map, tap } from 'rxjs';
import { Filter } from '../typings/filter';

@Injectable()
export class FilterService {

  private transformFn?: (params?: Maybe<{ [key: string]: any }>) => Filter;

  private definition?: { [s: number]: string };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  public queryParams(): Observable<Maybe<{ [key: string]: any }>> {
    return this.activatedRoute.queryParams
      .pipe(map(queryParams => {
        const params: Record<string, unknown> = {};
        
        if (this.definition) {
          Object.values(this.definition).forEach((key: any) => {  
            params[key] = queryParams[key] === 'true' || queryParams[key] === 'false'
              ? queryParams[key] === 'true'
              : queryParams[key];
          });
        }

        return params as { [key: string]: Maybe<string> };
      }));
  }

  public params(): Observable<Maybe<Filter>> {
    return this.queryParams()
      .pipe(
        filter(params => !!params),
        map(params => this.transformFn?.(params)),
      );
  }

  public filtersActive(): Observable<boolean> {
    return this.queryParams()
      .pipe(
        map(params => !!params && Object.values(params).some((value) => {
          switch(true) {
            case Array.isArray(value):
              return !!(value as Array<unknown>)?.length;
            default:
              return !!value;
          }
        })),
        tap(isActive => console.log('isActive', isActive))
      );
  }

  public init(init: {
    transformFn: (params?: Maybe<{ [key: string]: any }>) => Filter,
    definition: { [s: number]: string },
  }): void {
    this.transformFn = init.transformFn;
    this.definition = init.definition;
  }

  public updateParam(key: string, value: Maybe<string>): void {
    if (value === '') {
      value = undefined;
    }

    const newParams = {...this.activatedRoute.snapshot.params, [key]: value };

    this.router.navigate([], {
      queryParams: newParams as Params,
      queryParamsHandling: 'merge',
    });
  }

  public clearFilters(): void {
    const queryParams: { [key: string]: any } = {};

    if (this.definition) {
      Object.values(this.definition).forEach(key => queryParams[key] = undefined);
    }

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

}