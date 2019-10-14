import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { CardCountdownModule } from './card-countdown/card-countdown.module';
import { CardModule } from './card/card.module';
import { ModalModule } from './modal/modal.module';
import { PageHeaderModule } from './page-header/page-header.module';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    CardModule,
    CardCountdownModule,
    BreadcrumbModule,
    ModalModule,
    PageHeaderModule
  ]
})
export class ThemeComponentsModule { }
