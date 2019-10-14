import { MenuItem } from './menu-item';

export class MenuSection extends MenuItem {
  constructor(
    public name: string
  ) {
    super(name);
  }
}
