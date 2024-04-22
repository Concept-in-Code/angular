import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable()
export class ScrollRestorationService {

  private previousRoute?: string;

  constructor(
    private router: Router
  ) {

    /**
    * Subscribes to router events and restores scroll position to top
    * when the route changes (not just query parameter changes).
    */
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const currentRoute = (event as NavigationEnd).urlAfterRedirects?.split('?')[0];

        if (this.previousRoute && this.previousRoute !== currentRoute) {
          window.scrollTo(0, 0);
        }
        this.previousRoute = currentRoute;
      });
  }
}