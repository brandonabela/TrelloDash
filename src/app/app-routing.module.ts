import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AlertsComponent } from './pages/@theme/alerts/alerts.component';
import { CardsComponent } from './pages/@theme/cards/cards.component';
import { ModalsComponent } from './pages/@theme/modals/modals.component';
import { DocumentComponent } from './pages/@trello/document/document.component';
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
  { // Keep last in the array
    path: '**',
    component: InvalidPathComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  HomeComponent,

  AlertsComponent,
  CardsComponent,
  ModalsComponent,

  OverviewComponent,
  DocumentComponent
];