/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SidenavService } from '../services/sidenav-service';

@Directive({
  selector: '[sidenav]',
  standalone: true,
})
export class SidenavDirective implements OnDestroy {

  private destroy = new Subject<void>();

  constructor(
    private sidenavService: SidenavService,
    private viewContainer: ViewContainerRef) {
      this.sidenavService.toggled()
        .pipe(takeUntil(this.destroy))
        .subscribe(contentComponent => {
          if (contentComponent) {
            this.viewContainer.clear();
  
            const component = this.viewContainer
              .createComponent(contentComponent.component)
              .instance as any;
            
            if (contentComponent.params) {
              Object.entries(contentComponent.params).forEach(([key, value]) => {
                component[key] = value;
              });
            }
          }
        });
    }

  public ngOnDestroy(): void {
    this.viewContainer.clear();
    this.destroy.next();
    this.destroy.complete();
  }
}
