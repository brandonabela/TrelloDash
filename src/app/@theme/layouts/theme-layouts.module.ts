import { NgModule } from '@angular/core';

import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { PageHeaderComponent } from "./page-header/page-header.component";
import { PageBodyComponent } from "./page-body/page-body.component";
import { PageFooterComponent } from "./page-footer/page-footer.component";
import { DashboardLayoutComponent } from "./dashboard-layout/dashboard-layout.component";
import { ThemeComponentsModule } from "../components/theme-components.module";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    ThemeComponentsModule
  ],
  declarations: [
    SidebarComponent,
    NavigationComponent,
    PageHeaderComponent,
    PageBodyComponent,
    PageFooterComponent,
    DashboardLayoutComponent
  ],
  exports: [
    SidebarComponent,
    NavigationComponent,
    PageHeaderComponent,
    PageBodyComponent,
    PageFooterComponent,
    DashboardLayoutComponent
  ]
})
export class ThemeLayoutsModule { }
