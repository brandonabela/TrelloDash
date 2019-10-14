import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { CardModule } from '../card/card.module';
import { PageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [
    PageHeaderComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    BreadcrumbModule
  ],
  exports: [
    PageHeaderComponent
  ]
})
export class PageHeaderModule { }
