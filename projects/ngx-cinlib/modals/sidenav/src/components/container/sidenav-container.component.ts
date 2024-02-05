import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { SidenavService } from '../../services/sidenav-service';
import { SidenavContentComponent } from '../content/sidenav-content.component';

@Component({
  selector: 'cin-sidenav-container',
  templateUrl: './sidenav-container.component.html',
  styleUrls: ['./sidenav-container.component.scss'],
  standalone: true,
  imports: [
    CommonModule,

    SidenavContentComponent,

    MatSidenavModule,
  ]
})
export class SidenavContainerComponent implements OnInit, OnDestroy {

  @Input()
  public mode: MatDrawerMode = 'over';

  @Input()
  public position: 'start' | 'end' = 'end';

  @ViewChild(MatDrawer)
  public sidenav?: MatDrawer;

  private destroy = new Subject<void>();

  constructor(
    private sidenavService: SidenavService,
  ) {
  }

  public ngOnInit(): void {
    this.sidenavService.toggled()
      .pipe(takeUntil(this.destroy))
      .subscribe(component => component ? this.sidenav?.open() : this.sidenav?.close());
  }

  public close(): void {
    this.sidenavService.close();
  }

  public ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
