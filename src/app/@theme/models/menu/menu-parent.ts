import { MenuChild } from './menu-child';
import { MenuItem } from './menu-item';

export class MenuParent extends MenuItem {
  public readonly icon: string;
  public readonly children: MenuChild[];
  public readonly dropdownId: string;

  constructor(name: string, icon: string, children: MenuChild[]) {
    super(name);
    this.icon = icon;
    this.children = children;
    this.dropdownId = name.toLowerCase().replace(/\s+/g, '');
  }
}
