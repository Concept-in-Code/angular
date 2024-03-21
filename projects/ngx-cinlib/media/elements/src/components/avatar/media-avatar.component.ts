import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Maybe, Media } from 'ngx-cinlib/core';

@Component({
  selector: 'cin-media-avatar',
  templateUrl: './media-avatar.component.html',
  styleUrls: ['./media-avatar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,

  ]
})
export class MediaAvatarComponent implements AfterViewInit {

  @Input()
  public media?: Maybe<Media>;

  @Input()
  public name?: Maybe<string>;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2) { }

  public ngAfterViewInit(): void {
    const spanElement = this.elementRef.nativeElement.querySelector('.border-image');
    const spanWidth = spanElement.offsetWidth;

    let fontSize = parseFloat(spanWidth * 0.025 + 'rem');
    const minFontSize = 1;

    if (fontSize < minFontSize) {
      fontSize = minFontSize;
    }

    const finalFontSize = fontSize + 'rem';
    this.renderer.setStyle(spanElement, 'font-size', finalFontSize);
  }
}
