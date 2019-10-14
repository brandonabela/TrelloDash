import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ThemeComponentsModule } from './@theme/components/theme-components.module';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManageProjectComponent } from './pages/@trello/shared/manage-project/manage-project.component';
import { InvalidPathComponent } from './pages/invalid-path/invalid-path.component';
import { ContentFooterComponent } from './shared/components/content-footer/content-footer.component';
import { LeftNavigationComponent } from './shared/components/left-navigation/left-navigation.component';
import { TopNavigationComponent } from './shared/components/top-navigation/top-navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,

    LeftNavigationComponent,
    TopNavigationComponent,
    ContentFooterComponent,
    DashboardLayoutComponent,
    InvalidPathComponent,

    ManageProjectComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ThemeComponentsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
