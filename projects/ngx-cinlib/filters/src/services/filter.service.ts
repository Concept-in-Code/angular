import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Maybe } from 'ngx-cinlib/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class FilterService {

  private definition?: { [s: number]: string };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  public init(definition: { [s: number]: string }): void {
    this.definition = definition;
  }

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
      );
  }

  public updateParam(key: string, value: any): void {
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