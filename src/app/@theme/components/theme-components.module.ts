import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { CardCountdownModule } from './card-countdown/card-countdown.module';
import { CardModule } from './card/card.module';
import { FormModule } from './form/form.module';
import { ModalModule } from './modal/modal.module';
import { PageModule } from './page/page.module';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CardModule,
    CardCountdownModule,
    BreadcrumbModule,
    FormModule,
    ModalModule,
    PageModule
  ]
})
export class ThemeComponentsModule { }
