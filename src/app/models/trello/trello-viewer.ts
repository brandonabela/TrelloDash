import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { StorageService } from 'src/app/service/storage.service';
import { RequestService } from '../../service/request.service';
import { BoardFrequency } from '../dashboard-trello/board-frequency';
import { TrelloProject } from './trello-project';

export class TrelloViewer {
  public uniqueBoards: BoardFrequency[];
  public trelloProjects: TrelloProject[] = [];

  public storageLoaded = false;
  public storagePercentage = 0;

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService
  ) {
    this.storageService.getTrelloLinks().map(aTrelloUrl => {
      this.addTrelloProject(aTrelloUrl, true);
    });
  }

  public addURL(trelloUrl: string): void {
    // If invalid urls

    if (!trelloUrl.includes('trello.com/b/')) {
      return this.alertService.add(messages.trelloInvalidLink);
    }

    // Formatting the url path

    if (!trelloUrl.includes('.json')) {
      trelloUrl = 'https://trello.com/b/' + trelloUrl.split('/')[4] + '.json';
    }

    // Checking if the given url path was already added to the project

    if (this.trelloProjects.filter(aProject => aProject.projectJson === trelloUrl).length === 0) {
      this.addTrelloProject(trelloUrl, false);
    } else {
      this.alertService.add(messages.trelloAlreadyAdded);
    }
  }

  private addTrelloProject(trelloUrl: string, fromStorage: boolean): void {
    if (!fromStorage) {
      this.alertService.add(messages.trelloInitiateAdd);
    }

    this.requestService.getXhrResponse(trelloUrl).then((xhr: XMLHttpRequest) => {
      if (xhr.status === 200 && xhr.responseText !== '') {
        const trelloProject = new TrelloProject(JSON.parse(xhr.responseText));
        this.trelloProjects.push(trelloProject);

        this.updateBoards();

        if (!fromStorage) {
          this.storageService.addTrelloUrl(trelloUrl);
          this.alertService.add(messages.trelloSuccess);
        }
      } else {
        this.alertService.add(messages.trelloNoAccess);
      }

      const storageTrelloLinks = this.storageService.getTrelloLinks();

      if (fromStorage) {
        this.storagePercentage = ((this.trelloProjects.length / storageTrelloLinks.length) * 100);

        if (this.trelloProjects.length === storageTrelloLinks.length) {
          this.storageLoaded = true;
        }
      }
    });
  }

  public removeUrl(index: number) {
    this.trelloProjects.splice(index, 1);
    this.storageService.removeTrelloUrl(index);

    this.updateBoards();
  }

  public updateBoards(): void {
    const cardBoardNames = [].concat(...this.trelloProjects.map(aProject => aProject.trelloCards.map(aCard => aCard.cardBoardName)));
    const uniqueBoardNames = Array.from(new Set(cardBoardNames));

    this.uniqueBoards = uniqueBoardNames.map(aBoardName =>
      new BoardFrequency(aBoardName, cardBoardNames.filter(cardBoardName => cardBoardName === aBoardName).length)
    );
  }
}
