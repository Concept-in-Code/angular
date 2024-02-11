import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { I18nDirective } from 'ngx-cinlib/i18n';
import { IconComponent } from 'ngx-cinlib/icons';
import { Subject, take, takeUntil } from 'rxjs';
import { Sort, SortOption } from '../../typings/sort-paginate';

@Component({
  selector: 'cin-table-sort',
  templateUrl: './table-sort.component.html',
  styleUrls: ['./table-sort.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    I18nDirective,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ]
})
export class TableSortComponent implements OnInit, OnDestroy {

  @Input()
  public options?: SortOption[];

  @Input()
  public queryParams = true;

  @Output()
  public sortChange = new EventEmitter<Sort>();

  public control = new FormControl();

  private destroy = new Subject<void>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.watchValueChange();
  }
  
  public ngOnInit(): void {
    if (this.queryParams) {
      this.activatedRoute.queryParams
        .pipe(take(1))
        .subscribe((params: Sort) =>
          this.control.setValue(this.options?.find(option => option.field === params.sort &&
            (params.dir === 'desc' && params.dir === option.dir 
              || params.dir !== 'desc' )), {emitEvent: false })
        );
    }
  }

  private watchValueChange(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe((option?: SortOption) => {
        if (option) {
          this.sortChange.emit({
            dir: option.dir ?? 'asc',
            sort: option.field
          });
  
          if (this.queryParams) {
            this.router.navigate([], {
              queryParams: {
                dir: option.dir,
                sort: option.field,
              },
              queryParamsHandling: 'merge',
            });
          }
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }

}