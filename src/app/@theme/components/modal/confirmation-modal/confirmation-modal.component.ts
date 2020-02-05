import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input()
  public modalId: string;

  @Output()
  public modalChoice = new EventEmitter();

  private confirmAction(): void {
    this.modalChoice.emit(true);
  }

  private declineAction(): void {
    this.modalChoice.emit(false);
  }
}
