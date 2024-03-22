import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EditorConfig } from '@ckeditor/ckeditor5-core';

@Component({
  selector: 'cin-richtext-editor-form',
  templateUrl: './richtext-editor-form.component.html',
  styleUrls: ['./richtext-editor-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichtextEditorFormComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [
    CommonModule,
    CKEditorModule,
  ]
})

export class RichtextEditorFormComponent implements ControlValueAccessor {

  public Editor = ClassicEditor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public editorInstance: any;
  
  public model = {
    editorData: ''
  }

  @Input()
  public config: EditorConfig = {
    toolbar: [
      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'indent', 'outdent', '|', 'undo', 'redo'
    ]
  };

  constructor(
    private cdr: ChangeDetectorRef,
  ) {}

  private onChange?: (value: string) => void;
  private onTouch?: () => void;

  public writeValue(value: string): void {
    this.model.editorData = value;
    this.cdr.detectChanges();
  }

  public registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouch: () => void): void {
    this.onTouch = onTouch;
  }

  public handleEditorReady(editor: unknown): void {
    this.editorInstance = editor;
  }

  public handleEditorChange(): void {
    this.onTouch?.();
    this.onChange?.(
      this.editorInstance.getData()
    );
  }

}
