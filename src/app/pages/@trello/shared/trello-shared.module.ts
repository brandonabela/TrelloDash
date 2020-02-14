import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeComponentsModule } from 'src/app/@theme/components/theme-components.module';
import { LoadingProjectsComponent } from './loading-projects/loading-projects.component';
import { NoColumnsComponent } from './no-columns/no-columns.component';
import { NoProjectComponent } from './no-project/no-project.component';
import { TrelloCardComponent } from './trello-card/trello-card.component';

@NgModule({
  declarations: [
    LoadingProjectsComponent,
    NoColumnsComponent,
    NoProjectComponent,
    TrelloCardComponent
  ],
  imports: [
    CommonModule,
    ThemeComponentsModule
  ],
  exports: [
    LoadingProjectsComponent,
    NoColumnsComponent,
    NoProjectComponent,
    TrelloCardComponent,
  ]
})
export class TrelloSharedModule { }
