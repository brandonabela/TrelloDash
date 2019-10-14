import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalBodyComponent, ModalComponent, ModalFooterComponent, ModalTitleComponent } from './modal.component';

@NgModule({
  declarations: [
    ModalComponent,
    ModalTitleComponent,
    ModalBodyComponent,
    ModalFooterComponent
  ],
  imports: [CommonModule],
  exports: [
    ModalComponent,
    ModalTitleComponent,
    ModalBodyComponent,
    ModalFooterComponent
  ]
})
export class ModalModule { }
