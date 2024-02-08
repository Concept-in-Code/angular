import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Maybe } from 'ngx-cinlib/core';
import { IconComponent } from 'ngx-cinlib/icons';

@Component({
  selector: 'cin-website-piece',
  templateUrl: './website-piece.component.html',
  styleUrls: ['./website-piece.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
  ]
})
export class WebsitePieceComponent {

  @Input()
  public website?: Maybe<string>;
}
