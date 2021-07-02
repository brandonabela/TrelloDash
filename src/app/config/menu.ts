import { MenuChild } from '../shared/models/menu/menu-child';
import { MenuItem } from '../shared/models/menu/menu-item';
import { MenuParent } from '../shared/models/menu/menu-parent';
import { MenuSection } from '../shared/models/menu/menu-section';
import { MenuSingle } from '../shared/models/menu/menu-single';

export class Menu {
  public items: MenuItem[] = [
    new MenuSingle('Home', '/', 'fas fa-home'),
    new MenuSection('Theme'),
    new MenuParent('Components', 'fas fa-cogs', [
      new MenuChild('Accordions', '/theme/accordions'),
      new MenuChild('Alerts', '/theme/alerts'),
      new MenuChild('Buttons', '/theme/buttons'),
      new MenuChild('Button Group', '/theme/button-group'),
      new MenuChild('Cards', '/theme/cards'),
      new MenuChild('Dropdowns', '/theme/dropdowns'),
      new MenuChild('Modals', '/theme/modals'),
      new MenuChild('Tabs', '/theme/tabs'),
      new MenuChild('Tables', '/theme/tables'),
      new MenuChild('Typography', '/theme/typography'),
      new MenuChild('Progress Bars', '/theme/progress-bars')
    ]),
    new MenuParent('Error Pages', 'fas fa-ban', [
      new MenuChild('404', '/theme/404')
    ]),
    new MenuSection('Trello'),
    new MenuSingle('Projects', '/trello/projects', 'fas fa-project-diagram'),
    new MenuSingle('Query Editor', '/trello/query', 'fas fa-filter'),
    new MenuSingle('Mind Map', '/trello/mindmap', 'fas fa-sitemap')
  ];
}
