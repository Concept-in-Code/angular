import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, ContentChildren, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';
import { ConfirmService, ConfirmType } from 'ngx-cinlib/modals/confirm';
import { Subject, takeUntil } from 'rxjs';
import { DragDropElement } from '../../typings/drag-drop-element';
import { DragDropElementComponent } from '../element/drag-drop-element.component';

@Component({
  selector: 'cin-drag-drop-container',
  templateUrl: './drag-drop-container.component.html',
  styleUrls: ['./drag-drop-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    IconComponent,
    MatButtonModule,
    MatCardModule,
    NgComponentOutlet,
  ]
})
export class DragDropContainerComponent implements OnDestroy {

  @Input()
  public disabled?: Maybe<boolean>;

  @Input()
  public deletable?: Maybe<boolean> = true;

  @Output()
  public deleted = new EventEmitter<number>();

  @Output()
  public updated = new EventEmitter<number[]>();

  @ContentChildren(DragDropElementComponent)
  public set components(components: QueryList<DragDropElementComponent>) {
    this.elements = components?.length
      ? components.toArray().map((component, initIndex) => ({
          component,
          initIndex
        }))
      : [];
  }

  public elements!: DragDropElement[];

  private bodyElement: HTMLElement = document.body;

  private destroy = new Subject<void>();

  constructor(
    private confirmService: ConfirmService
  ) {}

  public drag(): void {
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.cursor = 'grabbing';
  }

  public drop(event: CdkDragDrop<DragDropElement[]>): void {
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';

    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
  
    this.emit();
  }

  public onDelete(index: number) {
    this.confirmService
      .confirm({ type: ConfirmType.Delete})
      .pipe(takeUntil(this.destroy))
      .subscribe(confirmed => {
        if (confirmed) {
          this.deleted.emit(index);
        }
      });
  }

  private emit(): void {
    this.updated.emit(this.elements.map(element => element.initIndex));
  }


  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}
