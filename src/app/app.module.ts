import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ThemeComponentsModule } from './@theme/components/theme-components.module';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrelloProjectNameFilter } from './filters/TrelloProjectNameFilter';
import { ManageProjectComponent } from './pages/@trello/manage-projects/manage-project/manage-project.component';
import { LoadingProjectsComponent } from './pages/@trello/shared/loading-projects/loading-projects.component';
import { NoProjectComponent } from './pages/@trello/shared/no-project/no-project.component';
import { PageLogicComponent } from './pages/@trello/shared/page-logic/page-logic.component';
import { InvalidPathComponent } from './pages/invalid-path/invalid-path.component';
import { ContentFooterComponent } from './shared/components/content-footer/content-footer.component';
import { LeftNavigationComponent } from './shared/components/left-navigation/left-navigation.component';
import { TopNavigationComponent } from './shared/components/top-navigation/top-navigation.component';

@NgModule({
  declarations: [
    // Angular Components

    AppComponent,
    RoutingComponents,

    // Dashboard Components

    LeftNavigationComponent,
    TopNavigationComponent,
    ContentFooterComponent,
    DashboardLayoutComponent,
    InvalidPathComponent,

    // Trello Components

    ManageProjectComponent,
    LoadingProjectsComponent,
    NoProjectComponent,
    PageLogicComponent,

    // Filters

    TrelloProjectNameFilter
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ThemeComponentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
