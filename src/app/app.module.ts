import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { ProjectComponent } from './pages/@trello/projects/project/project.component';
import { ExportCsvComponent } from './pages/@trello/projects/export-csv/export-csv.component';
import { ExportLatexComponent } from './pages/@trello/projects/export-latex/export-latex.component';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgChartsModule } from 'ng2-charts';
import { ToastrModule } from 'ngx-toastr';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { TrelloSharedModule } from './pages/@trello/shared/trello-shared.module';
import { ThemeComponentsModule } from './@theme/components/theme-components.module';
import { ThemeLayoutsModule } from "./@theme/layouts/theme-layouts.module";
import { ThemeFiltersModule } from "./@theme/filters/theme-filters.module";
import { FormComponent } from './pages/@theme/form/form.component';


@NgModule({
  declarations: [
    // Angular Components

    AppComponent,
    RoutingComponents,

    // Trello Components

    ProjectComponent,
    ExportCsvComponent,
    ExportLatexComponent,

    FormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

    NgChartsModule,
    ToastrModule.forRoot(),
    NgxGoogleAnalyticsModule.forRoot('307518136'),
    NgxGoogleAnalyticsRouterModule,

    TrelloSharedModule,
    ThemeComponentsModule,
    ThemeLayoutsModule,
    ThemeFiltersModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
