import { MenuChild } from '../@theme/models/menu/menu-child';
import { MenuItem } from '../@theme/models/menu/menu-item';
import { MenuParent } from '../@theme/models/menu/menu-parent';
import { MenuSection } from '../@theme/models/menu/menu-section';
import { MenuSingle } from '../@theme/models/menu/menu-single';

export class Menu {
  public items: MenuItem[] = [
    new MenuSingle('Projects', '/', 'fas fa-project-diagram'),
    new MenuSingle('Query Editor', '/query', 'fas fa-filter'),
    new MenuSingle('Mind Map', '/mind-map', 'fas fa-sitemap'),

    new MenuSection('Theme'),
    new MenuParent('Components', 'fas fa-cogs', [
      new MenuChild('Accordions', '/theme/accordions'),
      new MenuChild('Alerts', '/theme/alerts'),
      new MenuChild('Badges', '/theme/badges'),
      new MenuChild('Buttons', '/theme/buttons'),
      new MenuChild('Button Group', '/theme/button-group'),
      new MenuChild('Cards', '/theme/cards'),
      new MenuChild('Charts', '/theme/charts'),
      new MenuChild('Dropdowns', '/theme/dropdowns'),
      new MenuChild('Form', '/theme/form'),
      new MenuChild('Modals', '/theme/modals'),
      new MenuChild('Progress', '/theme/progress'),
      new MenuChild('Tabs', '/theme/tabs'),
      new MenuChild('Tables', '/theme/tables'),
      new MenuChild('Typography', '/theme/typography')
    ]),

    new MenuParent('Error Pages', 'fas fa-ban', [
      new MenuChild('404', '/theme/404')
    ])
  ];
}
