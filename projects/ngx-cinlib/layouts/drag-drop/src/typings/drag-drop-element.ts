import { DragDropElementComponent } from '../components/element/drag-drop-element.component';

export interface DragDropElement {
  component: DragDropElementComponent,
  initIndex: number,
  expanded?: boolean
}