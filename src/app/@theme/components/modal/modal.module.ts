import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalTitleComponent } from './modal.component';

@NgModule({
  declarations: [
    ModalComponent,
    ModalTitleComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ConfirmationModalComponent
  ],
  imports: [CommonModule],
  exports: [
    ModalComponent,
    ModalTitleComponent,
    ModalBodyComponent,
    ModalFooterComponent,
    ConfirmationModalComponent
  ]
})
export class ModalModule { }
