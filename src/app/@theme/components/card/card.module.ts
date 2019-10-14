import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardBodyComponent, CardComponent, CardHeaderComponent, CardSubtitleComponent, CardTitleComponent, CardToolsComponent } from './card.component';

@NgModule({
  declarations: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardToolsComponent,
    CardSubtitleComponent,
    CardBodyComponent
  ],
  imports: [CommonModule],
  exports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardToolsComponent,
    CardSubtitleComponent,
    CardBodyComponent
  ]
})
export class CardModule { }
