import { MenuItem } from './menu-item';

export class MenuSingle extends MenuItem {
  constructor(
    public name: string,
    public link: string,
    public icon: string,
    public isActive: boolean = false
  ) {
    super(name);
  }
}
