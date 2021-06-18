import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { StorageService } from 'src/app/service/storage.service';
import { RequestService } from '../../service/request.service';
import { BoardFrequency } from '../dashboard-trello/board-frequency';
import { TrelloCard } from './trello-card';
import { TrelloProject } from './trello-project';

export class TrelloViewer {
  private loadedProjects = 0;

  public uniqueBoards: BoardFrequency[];
  public trelloProjects: TrelloProject[];

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService
  ) {
    this.trelloProjects = this.storageService.getTrelloProjects();
    this.syncExpiredProjects();
  }

  public syncExpiredProjects(): void {
    const todayDate = new Date();

    for (let i = this.trelloProjects.length - 1; i >= 0; i--) {
      const projectDate = new Date(this.trelloProjects[i].expiryDate);

      if (todayDate > projectDate) {
        this.syncTrelloProject(i);
      } else {
        this.loadedProjects++;

        this.updateBoards();
      }
    }
  }

  public syncAllProjects(): void {
    this.loadedProjects = 0;

    for (let i = this.trelloProjects.length - 1; i >= 0; i--) {
      this.syncTrelloProject(i);
    }
  }

  private syncTrelloProject(index: number): void {
    this.updateProject(index, this.trelloProjects[index].validInDays);
  }

  public updateProject(index: number, days: number): void {
    const projectJson = this.trelloProjects[index].projectJson;

    this.updateProjectRemote(index, projectJson, days);
  }

  public addProject(trelloUrl: string, days: number): void {
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
      this.addProjectFromRemote(trelloUrl, days);
    } else {
      this.alertService.add(messages.trelloAlreadyAdded);
    }
  }

  private addProjectFromRemote(trelloUrl: string, days: number): void {
    this.alertService.add(messages.trelloInitAdd);

    this.requestService.getXhrResponse(trelloUrl).then((xhr: XMLHttpRequest) => {
      if (xhr.status === 200 && xhr.responseText !== '') {
        const trelloProject = new TrelloProject(JSON.parse(xhr.responseText), days);

        this.trelloProjects = this.storageService.addTrelloProject(trelloProject);
        this.updateBoards();

        this.loadedProjects++;

        this.alertService.add(messages.trelloSuccessAdd);
      } else {
        this.alertService.add(messages.trelloNoAccess);
      }
    });
  }

  private updateProjectRemote(index: number, trelloUrl: string, days: number): void {
    this.requestService.getXhrResponse(trelloUrl).then((xhr: XMLHttpRequest) => {
      if (xhr.status === 200 && xhr.responseText !== '') {
        const updatedProject = new TrelloProject(JSON.parse(xhr.responseText), days);

        this.trelloProjects = this.storageService.updateTrelloProject(index, updatedProject);
        this.updateBoards();

        // If user initiated update do not increment loaded projects

        if (this.loadedProjects !== this.trelloProjects.length) {
          this.loadedProjects++;
        }

        this.alertService.add(messages.trelloSuccessUpdated);
      }
    });
  }

  public removeProject(index: number) {
    this.trelloProjects = this.storageService.removeTrelloProject(index);
    this.updateBoards();

    this.loadedProjects--;

    this.alertService.add(messages.trelloSuccessRemove);
  }

  public updateBoards(): void {
    const cardBoardNames = [].concat(...this.trelloProjects.map(aProject => aProject.trelloCards.map(aCard => aCard.cardBoardName)));
    const uniqueBoardNames = Array.from(new Set(cardBoardNames));

    this.uniqueBoards = uniqueBoardNames.map(aBoardName =>
      new BoardFrequency(aBoardName, cardBoardNames.filter(cardBoardName => cardBoardName === aBoardName).length)
    );
  }

  public areProjectsLoaded(): boolean {
    return this.loadedProjects === this.trelloProjects.length;
  }

  public getStoragePercentage(): number {
    return (this.loadedProjects / this.trelloProjects.length) * 100;
  }

  public getTrelloCards(): TrelloCard[] {
    return [].concat(...this.trelloProjects.map(project =>
      project.trelloCards.map(trelloCard => {
        return Object.assign({ projectName: project.projectName }, trelloCard);
      })
    ));
  }
}
