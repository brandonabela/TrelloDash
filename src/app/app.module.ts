import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ThemeComponentsModule } from './@theme/components/theme-components.module';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { TrelloCardFilter } from './filters/TrelloCardFilter';
import { TrelloProjectFilter } from './filters/TrelloProjectFilter';
import { ProjectComponent } from './pages/@trello/projects/project/project.component';
import { TrelloSharedModule } from './pages/@trello/shared/trello-shared.module';
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

    ProjectComponent,

    // Filters

    TrelloCardFilter,
    TrelloProjectFilter
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InfiniteScrollModule,

    TrelloSharedModule,
    ThemeComponentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
