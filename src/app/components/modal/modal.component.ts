import { Component, inject, input, output } from '@angular/core';
import { IModal } from '../../interfaces/icomponents/modal.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  modalData = input<IModal>();
  close = output();

  showModal = false;

  onShowModal() {
      this.showModal = true;
  }

  onClose() {
    this.close.emit();
  }


}
