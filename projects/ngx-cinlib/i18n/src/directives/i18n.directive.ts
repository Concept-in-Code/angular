import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { Subject, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs';
import { TranslationService } from '../services/translation.service';

@Directive({
  selector: '[i18nLabel]',
  standalone: true,
})
export class I18nDirective implements OnInit, OnChanges, OnDestroy {

  @Input()
  public i18nLabel?: Maybe<string>;

  @Input()
  public preFix?: string;

  @Input()
  public suffix?: string;

  @Input()
  public variables?: Map<string, unknown>;

  private destroy = new Subject<void>();

  private labels = new Subject<string>();

  constructor(
    private el: ElementRef,
    private translationService: TranslationService) { }

  public ngOnInit(): void {
    this.labels.pipe(
      distinctUntilChanged(),
      switchMap(label => this.translationService.getLabel(label)),
      map(label => {
        if (this.variables?.entries()) {
          this.variables.forEach((value, key) => label = label?.replaceAll(`$\{${key?.toString()}}`, (value?.toString() || '')))
        }
        return label;
      }),
      takeUntil(this.destroy),
    ).subscribe(label => this.el.nativeElement.innerHTML = `${this.prefixing()}${label ?? ''}${this.suffixing()}`);

    if (this.i18nLabel) {
      this.labels.next(this.i18nLabel);
    }
  }

  private prefixing(): string {
    return this.preFix ? `${this.preFix} ` : '';
  }

  private suffixing(): string {
    return this.suffix ? ` ${this.suffix}` : '';
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['i18nLabel']) {
      this.labels.next(changes['i18nLabel'].currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
    this.labels.complete();
  }
}

