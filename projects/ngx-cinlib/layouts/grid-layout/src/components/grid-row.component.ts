import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, Renderer2, ViewChild } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { GridColumnDirective } from '../directives/grid-column.directive';

@Component({
  selector: 'cin-grid-row',
  templateUrl: './grid-row.component.html',
  styleUrls: ['./grid-row.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export class GridRowComponent implements AfterViewInit, OnDestroy {

  @Input()
  public columns?: Maybe<number | string>;

  @Input()
  public includeInMobile = false;

  /** @see {@link /styles/mobile-mixins.scss} */
  @Input()
  public maxMobileSize = 1023;

  @ViewChild('container')
  public container?: ElementRef;

  @ContentChildren(GridColumnDirective)
  public assignedColumns?: QueryList<GridColumnDirective>;

  private destroy = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private renderer: Renderer2,
  ) {}

  public ngAfterViewInit(): void {
    this.desktopWidth();
    this.mobileWidth();
  }

  private desktopWidth(): void {
    const childsAmount: Maybe<number> = this.container?.nativeElement.children.length;

    if (childsAmount) {
      const cellWidth = this.columns && Number(this.columns) > childsAmount
        ? 100 / Number(this.columns)
        : 100 / childsAmount;
  
      Array.from(this.container?.nativeElement.children as HTMLCollection)
        .forEach((element: Element, index: number) => {
          const cellColumns = this.assignedColumns?.get(index)?.cinAssignColumns;

          cellColumns
            ? this.setStyle(element, cellWidth * Number(cellColumns))
            : this.setStyle(element, cellWidth);
        });
    }
  }

  private mobileWidth(): void {
    if (!this.includeInMobile) {
      this.breakpointObserver.observe([
        `(max-width: ${this.maxMobileSize}px)`,
        `(min-width: ${this.maxMobileSize}px)`,
      ]).pipe(
        map(() => this.breakpointObserver.isMatched(`(max-width: ${this.maxMobileSize}px)`)),
        filter(isMobile => !!isMobile),
        takeUntil(this.destroy)
      ).subscribe(() => {
        Array.from(this.container?.nativeElement.children as HTMLCollection)
          .forEach((element: Element) => this.setStyle(element, 100, 0))
      });
    }
  }

  private setStyle(element: Element, cellWidth: number, gap = 1) {
    this.renderer.setStyle(element, 'width', `calc(${cellWidth}% - ${gap}rem)`);
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}