import { Directive, Input, OnChanges, ViewContainerRef } from '@angular/core';
import { Maybe, MediaAttribution } from 'ngx-cinlib/core';
import { MediaAttributionComponent } from '../components/attribution/media-attribution.component';
import { AttributionDirection } from '../typings/attribution-direction';

@Directive({
  selector: 'img[cinAttribution]',
  standalone: true,
})
export class MediaAttributionDirective implements OnChanges {

  @Input()
  public cinAttribution?: Maybe<MediaAttribution>;

  @Input()
  public direction: AttributionDirection = 'BOTTOM-RIGHT';

  constructor(
    private viewContainer: ViewContainerRef) { }

  public ngOnChanges(): void {
    this.viewContainer.clear();
    if (this.cinAttribution) {
      const component = this.viewContainer
        .createComponent(MediaAttributionComponent)
        .instance;

      component.attribution = this.cinAttribution;
      component.direction = this.direction;
    }
  }

}
