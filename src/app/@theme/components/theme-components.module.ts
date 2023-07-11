import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { CardCountdownModule } from './card-countdown/card-countdown.module';
import { FormModule } from './form/form.module';
import { ModalModule } from './modal/modal.module';
import { ThemeFiltersModule } from "../filters/theme-filters.module";

@NgModule({
  imports: [
    CommonModule,
    ThemeFiltersModule
  ],
  exports: [
    BreadcrumbModule,
    CardCountdownModule,
    FormModule,
    ModalModule
  ],
  declarations: []
})
export class ThemeComponentsModule { }
