import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  public routeChanged() {
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
}
