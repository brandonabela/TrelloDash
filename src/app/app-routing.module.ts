import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';
import { AccordionsComponent } from './pages/@theme/accordions/accordions.component';
import { AlertsComponent } from './pages/@theme/alerts/alerts.component';
import { ButtonGroupComponent } from './pages/@theme/button-group/button-group.component';
import { ButtonsComponent } from './pages/@theme/buttons/buttons.component';
import { CardsComponent } from './pages/@theme/cards/cards.component';
import { DropdownsComponent } from './pages/@theme/dropdowns/dropdowns.component';
import { ModalsComponent } from './pages/@theme/modals/modals.component';
import { ProgressBarsComponent } from './pages/@theme/progress-bars/progress-bars.component';
import { TablesComponent } from './pages/@theme/tables/tables.component';
import { TypographyComponent } from './pages/@theme/typography/typography.component';
import { MindMapComponent } from './pages/@trello/mind-map/mind-map.component';
import { ProjectsComponent } from './pages/@trello/projects/projects.component';
import { QueryComponent } from './pages/@trello/query/query.component';
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
        path: 'theme/accordions',
        component: AccordionsComponent,
        data: {
          breadcrumb: 'Accordions'
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
        path: 'theme/buttons',
        component: ButtonsComponent,
        data: {
          breadcrumb: 'Button'
        }
      },
      {
        path: 'theme/button-group',
        component: ButtonGroupComponent,
        data: {
          breadcrumb: 'Button Group'
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
        path: 'theme/dropdowns',
        component: DropdownsComponent,
        data: {
          breadcrumb: 'Dropdowns'
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
        path: 'theme/typography',
        component: TypographyComponent,
        data: {
          breadcrumb: 'Typography'
        }
      },
      {
        path: 'theme/progress-bars',
        component: ProgressBarsComponent,
        data: {
          breadcrumb: 'Progress Bars'
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
        path: 'trello/query',
        component: QueryComponent,
        data: {
          breadcrumb: 'Query Editor'
        }
      },
      {
        path: 'trello/mindmap',
        component: MindMapComponent,
        data: {
          breadcrumb: 'Mind Map'
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

  AccordionsComponent,
  AlertsComponent,
  ButtonsComponent,
  ButtonGroupComponent,
  CardsComponent,
  DropdownsComponent,
  ModalsComponent,
  TablesComponent,
  TypographyComponent,
  ProgressBarsComponent,

  ProjectsComponent,
  QueryComponent,
  MindMapComponent
];
