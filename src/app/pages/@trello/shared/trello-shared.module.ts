import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ThemeComponentsModule } from 'src/app/@theme/components/theme-components.module';
import { TrelloCardComponent } from './trello-card/trello-card.component';

@NgModule({
  declarations: [
    TrelloCardComponent
  ],
  imports: [
    CommonModule,
    ThemeComponentsModule
  ],
  exports: [
    TrelloCardComponent
  ]
})
export class TrelloSharedModule { }
