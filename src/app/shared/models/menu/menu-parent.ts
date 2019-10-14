import { MenuChild } from './menu-child';
import { MenuItem } from './menu-item';

export class MenuParent extends MenuItem {
  public dropdownId: string;

  constructor(
    public name: string,
    public icon: string,
    public children: MenuChild[]
  ) {
    super(name);

    this.dropdownId = this.getDropdownFormat(name);
  }

  public getDropdownFormat(name: string): string {
    return name.toLowerCase().split(' ').join('');
  }
}
