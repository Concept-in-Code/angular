import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IconComponent } from 'ngx-cinlib/icons';
import { SidenavDirective } from '../../directives/sidenav.directive';
import { SidenavService } from '../../services/sidenav-service';

@Component({
  selector: 'cin-sidenav-content',
  templateUrl: './sidenav-content.component.html',
  styleUrls: ['./sidenav-content.component.scss'],
  standalone: true,
  imports: [
    CommonModule,

    IconComponent,
    SidenavDirective,

    MatButtonModule,
  ]
})
export class SidenavContentComponent {

  constructor(
    private sidenavService: SidenavService
  ) { }

  public close(): void {
    this.sidenavService.close();
  }

}
