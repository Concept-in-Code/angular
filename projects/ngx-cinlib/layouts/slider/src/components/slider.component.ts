import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component, ContentChildren,
  ElementRef, QueryList, TemplateRef, ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    MatButtonModule
  ]
})
export class SliderComponent implements AfterViewInit {

  @ViewChild('content', { static: true, read: ElementRef })
  private content!: ElementRef;

  public disableRight = false;

  public disableLeft = true;

  private gap = 32;

  @ContentChildren(TemplateRef, { descendants: true })
  private template?: QueryList<TemplateRef<unknown>>;

  public ngAfterViewInit(): void {
    const gap = parseFloat(getComputedStyle(document.body).getPropertyValue('--gap'));
    const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    this.gap = (gap || 1) * (fontSize || 16);
  }

  public onScroll() {
    this.disableLeft = this.content?.nativeElement.scrollLeft === 0;
    this.disableRight = this.content?.nativeElement.scrollLeftMax === this.content?.nativeElement.scrollLeft;
  }


  public scroll(forward?: boolean): void {
    const scroll = this.calculateScroll();
    forward
      ? this.content.nativeElement.scrollLeft += scroll
      : this.content.nativeElement.scrollLeft -= scroll;
  }

  public calculateScroll(): number {
    const containerWidth = this.content.nativeElement.offsetWidth;
    if (this.template?.first?.elementRef?.nativeElement?.parentElement?.firstChild?.offsetWidth) {
      const elementWidth = (this.template.first.elementRef.nativeElement.parentElement.firstChild.offsetWidth + this.gap);
      return Math.floor(containerWidth / elementWidth) * elementWidth;
    }
    return 200;
  }

}
