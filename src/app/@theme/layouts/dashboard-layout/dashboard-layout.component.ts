import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {
  ngOnInit() {
    this.updateLayout();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateLayout();
  }

  public updateLayout() {
    const contentElement = document.querySelector('.content');
    const sidebarElement = document.querySelector('.sidebar');
    const navigationElement = document.querySelector('.navigation');

    if (contentElement && sidebarElement && navigationElement) {
      const smallDevice = window.innerWidth < 1440;

      contentElement.classList.toggle('expand', smallDevice);
      sidebarElement.classList.toggle('collapse', smallDevice);
      navigationElement.classList.toggle('expand', smallDevice);
    }
  }
}
