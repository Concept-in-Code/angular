import { Directive, HostListener, Input, OnDestroy } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { Maybe } from 'ngx-cinlib/core';
import { TranslationService } from 'ngx-cinlib/i18n';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[cinTooltip]',
  providers: [MatTooltip],
  standalone: true,
})
export class TooltipDirective implements OnDestroy {

  @Input()
  public cinTooltip?: Maybe<string>;

  @Input()
  public direction?: TooltipPosition;

  private subscription?: Subscription;

  constructor(
    private tooltip: MatTooltip,
    private translationService: TranslationService,
  ) { }

  @HostListener('mouseover')
  public onMouseOver(): void {
    this.subscription = this.translationService
      .getLabel(this.cinTooltip)
      .subscribe(label => {
        if (label) {
          this.tooltip.message = label;
          this.tooltip.position = this.direction ?? 'below';
          this.tooltip.show();
        }
      });
  }

  @HostListener('mouseout')
  public onMouseOut(): void {
    this.tooltip.hide();
    this.subscription?.unsubscribe();
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
