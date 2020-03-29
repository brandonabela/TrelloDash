import { Component, ElementRef, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent {
  @ViewChild('importData')
  public importDataElement: ElementRef;

  constructor(private storageService: StorageService) { }

  // Responsible for collapsing and expanding the left navigation

  public onToggleSidebar() {
    document.getElementsByClassName('content')[0].classList.toggle('fullContent');
    document.getElementsByClassName('leftNavigation')[0].classList.toggle('miniLeftNavigation');
    document.getElementsByClassName('topNavigation')[0].firstElementChild.classList.toggle('minimise-sidebar');
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
