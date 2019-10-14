import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from '../card/card.module';
import { CardCountdownComponent } from './card-countdown.component';
import { CardDarkDirective } from './directives/card-dark.directive';
import { CardInfoDirective } from './directives/card-info.directive';
import { CardPrimaryDirective } from './directives/card-primary.directive';
import { CardSuccessDirective } from './directives/card-success.directive';

@NgModule({
  declarations: [
    CardCountdownComponent,

    CardInfoDirective,
    CardPrimaryDirective,
    CardSuccessDirective,
    CardDarkDirective
  ],
  imports: [
    CommonModule,
    CardModule
  ],
  exports: [
    CardCountdownComponent,

    CardInfoDirective,
    CardPrimaryDirective,
    CardSuccessDirective,
    CardDarkDirective
  ]
})
export class CardCountdownModule { }
