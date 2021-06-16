import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AlertsComponent } from './pages/@theme/alerts/alerts.component';
import { CardsComponent } from './pages/@theme/cards/cards.component';
import { ModalsComponent } from './pages/@theme/modals/modals.component';
import { TablesComponent } from './pages/@theme/tables/tables.component';
import { ExportComponent as ExportComponent } from './pages/@trello/export/export.component';
import { MindMapComponent } from './pages/@trello/mind-map/mind-map.component';
import { ProjectsComponent } from './pages/@trello/projects/projects.component';
import { QueriesComponent } from './pages/@trello/queries/queries.component';
import { HomeComponent } from './pages/home/home.component';
import { InvalidPathComponent } from './pages/invalid-path/invalid-path.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        data: {
          breadcrumb: 'Home'
        }
      },
      {
        path: 'theme/alerts',
        component: AlertsComponent,
        data: {
          breadcrumb: 'Alerts'
        }
      },
      {
        path: 'theme/cards',
        component: CardsComponent,
        data: {
          breadcrumb: 'Cards'
        }
      },
      {
        path: 'theme/modals',
        component: ModalsComponent,
        data: {
          breadcrumb: 'Modals'
        }
      },
      {
        path: 'theme/tables',
        component: TablesComponent,
        data: {
          breadcrumb: 'Tables'
        }
      },
      {
        path: 'trello/projects',
        component: ProjectsComponent,
        data: {
          breadcrumb: 'Projects'
        }
      },
      {
        path: 'trello/queries',
        component: QueriesComponent,
        data: {
          breadcrumb: 'Queries'
        }
      },
      {
        path: 'trello/mindmap',
        component: MindMapComponent,
        data: {
          breadcrumb: 'Mind Map'
        }
      },
      {
        path: 'trello/export',
        component: ExportComponent,
        data: {
          breadcrumb: 'Export'
        }
      }
    ]
  },
  {
    path: 'theme/404',
    component: InvalidPathComponent
  },
  { // Keep last in the array
    path: '**',
    component: InvalidPathComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  HomeComponent,

  AlertsComponent,
  CardsComponent,
  ModalsComponent,
  TablesComponent,

  ProjectsComponent,
  QueriesComponent,
  MindMapComponent,
  ExportComponent
];
