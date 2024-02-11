import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { IconComponent } from 'ngx-cinlib/icons';
import { ShareButtonComponent } from 'ngx-cinlib/share';
import { TooltipDirective } from 'ngx-cinlib/tooltip';
import { CoreModule } from 'src/app/core/core.module';
import { CardModule } from 'src/app/shared/widgets/card/card.module';
import { AddressPieceComponent } from '../../layout/address/address-piece.component';
import { CategoryPieceComponent } from '../../layout/category/category-piece.component';
import { MediaFormModule } from '../../media/modules/form/media-form.module';
import { FavoriteComponent } from '../favorite/favorite.component';
import { TableActionsComponent } from './components/actions/table-actions.component';
import { TableCardComponent } from './components/card/table-card.component';
import { TableCellAddressComponent } from './components/cells/table-cell-address.component';
import { TableCellBooleanComponent } from './components/cells/table-cell-boolean.component';
import { TableCellCategoryComponent } from './components/cells/table-cell-category.component';
import { TableCellColorComponent } from './components/cells/table-cell-color.component';
import { TableCellDefaultComponent } from './components/cells/table-cell-default.component';
import { TableCellHtmlComponent } from './components/cells/table-cell-html.component';
import { TableCellIconComponent } from './components/cells/table-cell-icon.component';
import { TableCellMediaComponent } from './components/cells/table-cell-media.component';
import { TableDesktopComponent } from './components/desktop/table-desktop.component';
import { TableMobileComponent } from './components/mobile/table-mobile.component';
import { TablePaginatorComponent } from './components/paginator/table-paginator.component';
import { TableSortComponent } from './components/sort/table-sort.component';
import { TableComponent } from './components/table.component';
import { tableStateKey } from './constants/table.constants';
import { CellDirective } from './directives/table-cell.directive';
import { TablePaginatorService } from './services/table-paginator.service';
import { TableEffects } from './state/table.effects';
import { tableReducer } from './state/table.reducer';

const exportComponents = [
  TableComponent,
  TableCardComponent,
  TablePaginatorComponent,
  TableSortComponent,
];

const components = [
  TableActionsComponent,
  TableDesktopComponent,
  TableMobileComponent,
];

const cellComponents = [
  TableCellAddressComponent,
  TableCellBooleanComponent,
  TableCellCategoryComponent,
  TableCellColorComponent,
  TableCellDefaultComponent,
  TableCellHtmlComponent,
  TableCellIconComponent,
  TableCellMediaComponent,
]

const directives = [
  CellDirective,
];

const framework = [
  CommonModule,
  FormsModule,
  NgComponentOutlet,
  ReactiveFormsModule,
  RouterModule,
];

const materials = [
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatDividerModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
];

const modules = [
  AddressPieceComponent,
  CardModule,
  CategoryPieceComponent,
  CoreModule,
  FavoriteComponent,
  MediaFormModule,
];

const libs = [
  StoreModule.forFeature(tableStateKey, tableReducer),
  EffectsModule.forFeature([TableEffects]),

  IconComponent,
  TooltipDirective,
  ShareButtonComponent,
];

const providers = [
  {
    provide: MatPaginatorIntl,
    useClass: TablePaginatorService,
  }
]

@NgModule({
  declarations: [
    ...exportComponents,
    ...components,
    ...cellComponents,
    ...directives,
  ],
  imports: [
    ...framework,
    ...materials,
    ...modules,
    ...libs,
  ],
  exports: [
    ...exportComponents,
    ...directives,
  ],
  providers: [
    ...providers
  ]
})
export class TableModule { }