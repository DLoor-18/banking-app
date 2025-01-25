import { Component, inject, input, output } from '@angular/core';
import { IDialog } from '../../interfaces/icomponents/dialog.interface';
import { DialogService } from '../../services/utils/dialog.service';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  private dialogService = inject(DialogService);

  dialogData: IDialog | undefined;
  clickLeftButton = output();
  clickRightButton = output();
  presentDialog = input<boolean>(true);
  showDialog = false;

  constructor() {
    this.dialogService.$dialogData.subscribe(dialogData => {     
      this.showDialog = true;
      this.dialogData = dialogData;
    });
  }

  onClose() {
    this.showDialog = false;
  }

  onClickLeftButton() {
    this.showDialog = false;
    this.clickLeftButton.emit();
  }

  onClickRightButton() {
    this.clickRightButton.emit();
  }

}
