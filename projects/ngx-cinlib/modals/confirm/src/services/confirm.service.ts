import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../components/confirm.component';
import { Confirm, ConfirmInput, ConfirmType, ConfirmTypeInput } from '../typings/confirm';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  constructor(
    private dialog: MatDialog
  ) {}

  public confirm(data: Confirm): Observable<boolean> {
    return this.dialog.open(ConfirmComponent, {
      data: Object.hasOwn(data, 'type')
        ? this.createInput(data as ConfirmTypeInput)
        : data as ConfirmInput
    }).afterClosed();
  }

  private createInput(input: ConfirmTypeInput): ConfirmInput {
    switch (input?.type) {
      case ConfirmType.Cancel:
        return {
          context: input?.context,
          buttonColor: 'primary',
          buttonLabel: 'confirm',
          messageLabel: 'areYouSureToCancel?',
          titleLabel: 'confirm'
        };
      case ConfirmType.Delete:
        return {
          context: input?.context,
          buttonColor: 'warn',
          buttonLabel: 'delete',
          messageLabel: 'areYouSureToDelete?',
          titleLabel: 'delete'
        };
      case ConfirmType.Reset:
        return {
          context: input?.context,
          buttonColor: 'primary',
          buttonLabel: 'confirm',
          messageLabel: 'areYouSureToReset?',
          titleLabel: 'confirm'
        };
      case ConfirmType.Change:
      default: 
        return {
          context: input?.context,
          buttonColor: 'primary',
          buttonLabel: 'confirm',
          messageLabel: 'areYouSureToChange?',
          titleLabel: 'confirmChanges'
        };
    }
  }
}
