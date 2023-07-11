import { MenuItem } from './menu-item';

export class MenuSingle extends MenuItem {
  public readonly link: string;
  public readonly icon: string;
  public readonly isActive: boolean;

  constructor(name: string, link: string, icon: string, isActive = false) {
    super(name);
    this.link = link;
    this.icon = icon;
    this.isActive = isActive;
  }
}
