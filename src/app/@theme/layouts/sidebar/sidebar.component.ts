import { Component } from '@angular/core';
import { Menu } from '../../../config/menu';
import { MenuItem } from '../../models/menu/menu-item';
import { MenuParent } from '../../models/menu/menu-parent';
import { MenuSection } from '../../models/menu/menu-section';
import { MenuSingle } from '../../models/menu/menu-single';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public menuItems = new Menu().items;

  public getMenuSingle(menuItem: MenuItem): MenuSingle | undefined {
    return (menuItem instanceof MenuSingle) ? menuItem : undefined;
  }

  public getMenuSection(menuItem: MenuItem): MenuSection | undefined {
    return (menuItem instanceof MenuSection) ? menuItem : undefined;
  }

  public getMenuParent(menuItem: MenuItem): MenuParent | undefined {
    return (menuItem instanceof MenuParent) ? menuItem : undefined;
  }
}
