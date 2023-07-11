import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardCountdownComponent } from './card-countdown.component';
import { CardColourDirective } from './card-colour.directive';

@NgModule({
  declarations: [
    CardCountdownComponent,
    CardColourDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardCountdownComponent,
    CardColourDirective
  ]
})
export class CardCountdownModule { }
