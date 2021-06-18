import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardToolsComponent } from './card.component';

@NgModule({
  declarations: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardToolsComponent,
    CardBodyComponent
  ],
  imports: [CommonModule],
  exports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardToolsComponent,
    CardBodyComponent
  ]
})
export class CardModule { }
