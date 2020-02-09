import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AlertsComponent } from './pages/@theme/alerts/alerts.component';
import { CardsComponent } from './pages/@theme/cards/cards.component';
import { ModalsComponent } from './pages/@theme/modals/modals.component';
import { TablesComponent } from './pages/@theme/tables/tables.component';
import { DocumentComponent } from './pages/@trello/document/document.component';
import { ManageProjectsComponent } from './pages/@trello/manage-projects/manage-projects.component';
import { OverviewComponent } from './pages/@trello/overview/overview.component';
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
        path: 'trello/manage',
        component: ManageProjectsComponent,
        data: {
          breadcrumb: 'Manage Projects'
        }
      },
      {
        path: 'trello/overview',
        component: OverviewComponent,
        data: {
          breadcrumb: 'Overview'
        }
      },
      {
        path: 'trello/document',
        component: DocumentComponent,
        data: {
          breadcrumb: 'Document'
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
    initialNavigation: 'enabled'
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

  ManageProjectsComponent,
  OverviewComponent,
  DocumentComponent
];
