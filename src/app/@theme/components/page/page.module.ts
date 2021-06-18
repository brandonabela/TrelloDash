import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbModule } from '../breadcrumb/breadcrumb.module';
import { PageBodyComponent, PageHeaderComponent } from './page.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    PageBodyComponent
  ],
  imports: [
    CommonModule,
    BreadcrumbModule
  ],
  exports: [
    PageHeaderComponent,
    PageBodyComponent
  ]
})
export class PageModule { }
