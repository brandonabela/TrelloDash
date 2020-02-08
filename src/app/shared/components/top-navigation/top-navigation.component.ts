import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {
  @ViewChild('importData')
  public importDataElement: ElementRef;

  constructor(private storageService: StorageService) { }

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

  // Responsible for collapsing and expanding the left navigation

  public onToggleSidebar() {
    document.getElementsByClassName('content')[0].classList.toggle('fullContent');
    document.getElementsByClassName('leftNavigation')[0].classList.toggle('miniLeftNavigation');
    document.getElementsByClassName('topNavigation')[0].firstElementChild.classList.toggle('minimise-sidebar');
  }

  // Responsible for handling the colour change of the search bar

  public onSearchBoxFocus() {
    document.getElementsByClassName('navigationSearch')[0].firstElementChild.classList.add('focused');
  }

  public onSearchBoxBlur() {
    document.getElementsByClassName('navigationSearch')[0].firstElementChild.classList.remove('focused');
  }

  // Responsible for handling website data

  public downloadData(): void {
    this.storageService.exportStorage();
  }

  public importData(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.storageService.importStorage(target.files[0]);
  }
}
