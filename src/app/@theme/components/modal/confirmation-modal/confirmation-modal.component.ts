import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() modalId = '';
  @Output() modalChoice = new EventEmitter<boolean>();

  confirmAction(): void {
    this.modalChoice.emit(true);
  }

  declineAction(): void {
    this.modalChoice.emit(false);
  }
}
