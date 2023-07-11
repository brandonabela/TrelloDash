import { DashboardLayoutComponent } from './@theme/layouts/dashboard-layout/dashboard-layout.component';

import { AccordionsComponent } from './pages/@theme/accordions/accordions.component';
import { AlertsComponent } from './pages/@theme/alerts/alerts.component';
import { BadgesComponent } from './pages/@theme/badges/badges.component';
import { ButtonsComponent } from './pages/@theme/buttons/buttons.component';
import { ButtonGroupComponent } from './pages/@theme/button-group/button-group.component';
import { CardsComponent } from './pages/@theme/cards/cards.component';
import { ChartsComponent } from "./pages/@theme/charts/charts.component";
import { DropdownsComponent } from './pages/@theme/dropdowns/dropdowns.component';
import { FormComponent } from './pages/@theme/form/form.component';
import { ModalsComponent } from './pages/@theme/modals/modals.component';
import { TabsComponent } from './pages/@theme/tabs/tabs.component';
import { TablesComponent } from './pages/@theme/tables/tables.component';
import { TypographyComponent } from './pages/@theme/typography/typography.component';
import { ProgressComponent } from './pages/@theme/progress/progress.component';

import { ProjectsComponent } from './pages/@trello/projects/projects.component';
import { QueryComponent } from './pages/@trello/query/query.component';
import { MindMapComponent } from './pages/@trello/mind-map/mind-map.component';

import { InvalidPathComponent } from './pages/invalid-path/invalid-path.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        component: ProjectsComponent,
        data: {
          breadcrumb: 'Projects'
        }
      },
      {
        path: 'query',
        component: QueryComponent,
        data: {
          breadcrumb: 'Query Editor'
        }
      },
      {
        path: 'mind-map',
        component: MindMapComponent,
        data: {
          breadcrumb: 'Mind Map'
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
        path: 'theme/badges',
        component: BadgesComponent,
        data: {
          breadcrumb: 'Badges'
        }
      },
      {
        path: 'theme/buttons',
        component: ButtonsComponent,
        data: {
          breadcrumb: 'Buttons'
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
        path: 'theme/charts',
        component: ChartsComponent,
        data: {
          breadcrumb: 'Charts'
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
        path: 'theme/form',
        component: FormComponent,
        data: {
          breadcrumb: 'Form'
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
        path: 'theme/progress',
        component: ProgressComponent,
        data: {
          breadcrumb: 'Progress Bars'
        }
      },
      {
        path: 'theme/tabs',
        component: TabsComponent,
        data: {
          breadcrumb: 'Tabs'
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
      }
    ]
  },
  {
    path: '**',
    component: InvalidPathComponent
  },
  {
    path: 'theme/404',
    component: InvalidPathComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const RoutingComponents = [
  ProjectsComponent,
  QueryComponent,
  MindMapComponent,

  AccordionsComponent,
  AlertsComponent,
  BadgesComponent,
  ButtonsComponent,
  ButtonGroupComponent,
  CardsComponent,
  ChartsComponent,
  DropdownsComponent,
  ModalsComponent,
  ProgressComponent,
  TabsComponent,
  TablesComponent,
  TypographyComponent,

  InvalidPathComponent
];
