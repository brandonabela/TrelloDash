import { Component } from '@angular/core';
import { Menu } from '../../../config/menu';
import { MenuItem } from '../../models/menu/menu-item';
import { MenuParent } from '../../models/menu/menu-parent';
import { MenuSection } from '../../models/menu/menu-section';
import { MenuSingle } from '../../models/menu/menu-single';

@Component({
  selector: 'left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent {
  public menu = new Menu();

  public getMenuSingle(menuItem: MenuItem): MenuSingle {
    return (menuItem instanceof MenuSingle) ? menuItem as MenuSingle : undefined;
  }

  public getMenuSection(menuItem: MenuItem): MenuSection {
    return (menuItem instanceof MenuSection) ? menuItem as MenuSection : undefined;
  }

  public getMenuParent(menuItem: MenuItem): MenuParent {
    return (menuItem instanceof MenuParent) ? menuItem as MenuParent : undefined;
  }
}
