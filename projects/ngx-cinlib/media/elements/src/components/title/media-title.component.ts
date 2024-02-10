import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe, Media } from 'ngx-cinlib/core';
import { MediaElementComponent } from '../element/media-element.component';

@Component({
  selector: 'cin-media-title',
  templateUrl: './media-title.component.html',
  styleUrls: ['./media-title.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MediaElementComponent,
  ]
})
export class MediaTitleComponent {

  @Input()
  public media?: Maybe<Media>;

}
