import { Component, OnInit } from '@angular/core';
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
export class LeftNavigationComponent implements OnInit {
  public menu = new Menu();

  // Handling Screen Width

  ngOnInit(): void {
    this.updateSideNavigation();

    window.addEventListener('resize', this.throttled(this.updateSideNavigation, 200));

    window.addEventListener('click', ($event: Event) => {
      this.collapseOnContent($event);
    });
  }

  public throttled(callback: () => void, delay: number) {
    let flag = true;

    return () => {
      const args = arguments;
      const context = this;

      if (flag) {
        callback.apply(context, args);
        flag = false;

        setTimeout(() => {
          flag = true;
        }, delay);
      }
    };
  }

  public updateSideNavigation() {
    if (window.innerWidth < 1440) {
      document.getElementsByClassName('content')[0].classList.add('fullContent');
      document.getElementsByClassName('leftNavigation')[0].classList.add('miniLeftNavigation');
      document.getElementsByClassName('topNavigation')[0].firstElementChild.classList.add('minimise-sidebar');
    } else {
      document.getElementsByClassName('content')[0].classList.remove('fullContent');
      document.getElementsByClassName('leftNavigation')[0].classList.remove('miniLeftNavigation');
      document.getElementsByClassName('topNavigation')[0].firstElementChild.classList.remove('minimise-sidebar');
    }
  }

  public collapseOnContent($event: Event) {
    if (window.innerWidth < 1440) {
      const topNavigation = document.getElementsByClassName('topNavigation')[0];
      const leftNavigation = document.getElementsByClassName('leftNavigation')[0];

      if (
        $event.target !== topNavigation && !topNavigation.contains($event.target as Node) &&
        $event.target !== leftNavigation && !leftNavigation.contains($event.target as Node)
      ) {
        this.updateSideNavigation();
      }
    }
  }

  // Menu Creation Handling

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
