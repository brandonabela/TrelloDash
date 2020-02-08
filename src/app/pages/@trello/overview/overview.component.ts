import { Component } from '@angular/core';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { StorageService } from 'src/app/service/storage.service';
import { RequestService } from 'src/app/service/request.service';

@Component({
  selector: 'page-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  public trelloViewer: TrelloViewer;

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService
  ) {
    this.trelloViewer = new TrelloViewer(this.alertService, this.storageService, this.requestService);
  }

  public boardStatisticsClass(currentIndex: number, total: number): string {
    switch (total) {
      case 1:
        return 'col-xl-12';
      case 2:
        return 'col-xl-6';
      case 3:
        return 'col-xl-4';
      case 4:
        return 'col-xl-3';
      case 5:
        if (currentIndex <= 3) {
          return 'col-xl-4';
        } else {
          return 'col-xl-6';
        }
      case 6:
        return 'col-xl-4';
      default:
        if (currentIndex <= 4) {
          return 'col-xl-3';
        } else {
          return this.boardStatisticsClass(currentIndex - 4, total - 4);
        }
    }
  }
}
