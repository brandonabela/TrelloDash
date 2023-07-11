import { Component } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  constructor(private storageService: StorageService) { }

  public onToggleSidebar() {
    const contentElement = document.querySelector('.content');
    const sidebarElement = document.querySelector('.sidebar');
    const navigationElement = document.querySelector('.navigation');

    if (contentElement && sidebarElement && navigationElement) {
      contentElement.classList.toggle('expand');
      sidebarElement.classList.toggle('collapse');
      navigationElement.classList.toggle('expand');
    }
  }

  public downloadData(): void {
    this.storageService.exportStorage();
  }

  public importData(event: Event): void {
    const files = (event.target as HTMLInputElement).files;

    if (files != null) {
      this.storageService.importStorage(files[0]);
    }
  }

  public clearData(): void {
    this.storageService.clearTrelloStorage();
  }
}
