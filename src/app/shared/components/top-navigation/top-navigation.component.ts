import { Component, ElementRef, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent {
  @ViewChild('importData', { static: false })
  public importDataElement: ElementRef;

  constructor(private storageService: StorageService) { }

  // Responsible for collapsing and expanding the left navigation

  public onToggleSidebar() {
    // Updating the components

    document.getElementsByClassName('content')[0].classList.toggle('fullContent');
    document.getElementsByClassName('leftNavigation')[0].classList.toggle('miniLeftNavigation');
    document.getElementsByClassName('topNavigation')[0].firstElementChild.classList.toggle('minimise-sidebar');

    // Updating the Brand Text

    if (document.getElementsByClassName('fullLogoBanner')[0].classList.contains('d-none')) {
      document.getElementsByClassName('fullLogoBanner')[0].classList.remove('d-none');
      document.getElementsByClassName('miniLogoBanner')[0].classList.add('d-none');
    } else {
      document.getElementsByClassName('fullLogoBanner')[0].classList.add('d-none');
      document.getElementsByClassName('miniLogoBanner')[0].classList.remove('d-none');
    }
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

  public uploadData(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.storageService.importStorage(target.files[0]);
  }
}
