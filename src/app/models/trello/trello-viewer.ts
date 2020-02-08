import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { StorageService } from 'src/app/service/storage.service';
import { RequestService } from '../../service/request.service';
import { BoardFrequency } from '../dashboard-trello/board-frequency';
import { TrelloProject } from './trello-project';

export class TrelloViewer {
  public uniqueBoards: BoardFrequency[];
  public trelloProjects: TrelloProject[] = [];

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService
  ) {
    const todayDate = new Date();
    const storageTrello = this.storageService.getTrelloProjects();

    for (let i = storageTrello.length - 1; i >= 0; i --) {
      const projectDate = new Date(storageTrello[i].expiryDate);

      if (todayDate < projectDate) {
        this.addTrelloProjectFromStorage(storageTrello[i]);
      } else {
        this.syncTrelloProject(i);
      }
    }
  }

  public addURL(trelloUrl: string, days: number): void {
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
      this.addTrelloProjectFromRemote(trelloUrl, days);
    } else {
      this.alertService.add(messages.trelloAlreadyAdded);
    }
  }

  private addTrelloProjectFromStorage(trelloProject: TrelloProject): void {
    this.trelloProjects.push(trelloProject);
    this.updateBoards();
  }

  private addTrelloProjectFromRemote(trelloUrl: string, days: number): void {
    this.alertService.add(messages.trelloInitiateAdd);

    this.requestService.getXhrResponse(trelloUrl).then((xhr: XMLHttpRequest) => {
      if (xhr.status === 200 && xhr.responseText !== '') {
        const trelloProject = new TrelloProject(JSON.parse(xhr.responseText), days);

        this.trelloProjects.push(trelloProject);
        this.storageService.addTrelloProject(trelloProject);

        this.updateBoards();

        this.alertService.add(messages.trelloSuccessAdd);
      } else {
        this.alertService.add(messages.trelloNoAccess);
      }
    });
  }

  public areProjectsLoaded(): boolean {
    return this.trelloProjects.length === this.storageService.getTrelloProjects().length;
  }

  public getStoragePercentage(): number {
    return ((this.trelloProjects.length / this.storageService.getTrelloProjects().length) * 100);
  }

  public updateBoards(): void {
    const cardBoardNames = [].concat(...this.trelloProjects.map(aProject => aProject.trelloCards.map(aCard => aCard.cardBoardName)));
    const uniqueBoardNames = Array.from(new Set(cardBoardNames));

    this.uniqueBoards = uniqueBoardNames.map(aBoardName =>
      new BoardFrequency(aBoardName, cardBoardNames.filter(cardBoardName => cardBoardName === aBoardName).length)
    );
  }

  public removeProject(index: number) {
    this.trelloProjects.splice(index, 1);
    this.storageService.removeTrelloProject(index);

    this.updateBoards();

    this.alertService.add(messages.trelloSuccessRemove);
  }

  public updateProject(index: number, days: number) {
    const projectLink = this.storageService.getTrelloProjects()[index].projectLink;

    this.removeProject(index);

    this.addURL(projectLink, days);
  }

  public syncTrelloProject(index: number) {
    const storageTrello = this.storageService.getTrelloProjects();

    this.updateProject(index, storageTrello[index].validInDays);
  }

  public syncTrelloProjects(): void {
    for (let i = this.trelloProjects.length - 1; i >= 0; i --) {
      this.syncTrelloProject(i);
    }
  }
}
