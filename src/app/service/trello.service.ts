import { Injectable } from "@angular/core";
import { messages } from 'src/app/constants/messages';

import { AlertService } from 'src/app/@theme/service/alert.service';
import { StorageService } from 'src/app/service/storage.service';
import { RequestService } from './request.service';

import { TrelloCard } from '../models/trello/trello-card';
import { TrelloProject } from '../models/trello/trello-project';
import { BoardFrequency } from '../models/dashboard-trello/board-frequency';


@Injectable({
  providedIn: 'root'
})
export class TrelloService {
  private static TRELLO_BASE_URL = 'https://trello.com/b/';
  private static TRELLO_JSON_EXTENSION = '.json';

  private loadedProjects: number = 0;
  public loadedPercentage: number = 0;
  public areProjectsLoaded: boolean = false;

  public uniqueBoards: BoardFrequency[] = [];
  public trelloProjects: TrelloProject[] = [];

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService
  ) {
    this.trelloProjects = this.storageService.getTrelloProjects();

    this.trelloProjects.length > 0 ? this.syncExpiredProjects() : this.updateStatistics(0);
  }

  public syncAllProjects(): void {
    this.loadedProjects = 0;

    this.trelloProjects.forEach((_, index) => {
      this.updateProjectRemote(index, () => this.updateStatistics(1));
    });
  }

  public syncProject(index: number): void {
    this.loadedProjects --;
    this.updateProjectRemote(index, () => this.updateStatistics(1));
  }

  public syncExpiredProjects(): void {
    const todayDate = new Date();
    const expiredProjectIndices: number[] = [];

    this.trelloProjects.forEach(({ expiryDate }, index) => {
      if (todayDate > new Date(expiryDate)) {
        expiredProjectIndices.push(index);
      }
      else {
        this.updateStatistics(1);
      }
    });

    expiredProjectIndices.forEach((index) => {
      this.updateProjectRemote(index, () => this.updateStatistics(1));
    });
  }

  public updateRenewalPeriod(index: number, renewalPeriod: number): void {
    const updatedProject = this.trelloProjects[index];
    updatedProject.setRenewalPeriod(renewalPeriod);

    this.trelloProjects = this.storageService.updateTrelloProject(index, updatedProject);
  }

  private updateProjectRemote(index: number, callback: () => void): void {
    const projectLink = `${this.trelloProjects[index].projectLink}${TrelloService.TRELLO_JSON_EXTENSION}`;
    const renewalPeriod = this.trelloProjects[index].renewalPeriod;

    this.requestService.getResponse(projectLink).subscribe({
      next: (data: string) => {
        const updatedProject = new TrelloProject(JSON.parse(data), renewalPeriod);
        this.trelloProjects = this.storageService.updateTrelloProject(index, updatedProject);

        callback();
        this.alertService.add(messages.trelloSuccessUpdated);
      },
      error: () => {
        this.alertService.add(messages.trelloNoAccess);
      }
    });
  }

  public addProject(trelloUrl: string, days: number = 1): void {
    const boardIdPattern = /(?:https?:\/\/)?(?:www\.)?trello\.com\/b\/(\w+)/;
    const boardId = boardIdPattern.exec(trelloUrl)?.[1];

    trelloUrl = `${TrelloService.TRELLO_BASE_URL}${boardId}${TrelloService.TRELLO_JSON_EXTENSION}`;

    if (!trelloUrl.includes(TrelloService.TRELLO_BASE_URL)) {
      return this.alertService.add(messages.trelloInvalidLink);
    }

    if (this.trelloProjects.some(aProject => aProject.projectJson === trelloUrl)) {
      return this.alertService.add(messages.trelloAlreadyAdded);
    }

    this.addProjectFromRemote(trelloUrl, days, () => this.updateStatistics(1));
  }

  private addProjectFromRemote(projectLink: string, days: number, callback: () => void): void {
    this.alertService.add(messages.trelloInitAdd);

    this.requestService.getResponse(projectLink).subscribe({
      next: (data: string) => {
        const trelloProject = new TrelloProject(JSON.parse(data), days);
        this.trelloProjects = this.storageService.addTrelloProject(trelloProject);

        callback();
        this.alertService.add(messages.trelloSuccessAdd);
      },
      error: () => {
        this.alertService.add(messages.trelloNoAccess);
      }
    });
  }

  public removeProject(index: number): void {
    this.trelloProjects = this.storageService.removeTrelloProject(index);
    this.alertService.add(messages.trelloSuccessRemove);
    this.updateStatistics(-1);
  }

  private updateStatistics(shift: number = 0): void {
    const storageProjects = this.storageService.getTrelloProjects().length;

    this.loadedProjects += shift;
    this.loadedPercentage = this.loadedProjects / storageProjects * 100;
    this.areProjectsLoaded = this.loadedProjects === storageProjects;

    if (this.areProjectsLoaded) {
      this.updateBoards();
    }
  }

  public updateBoards(): void {
    const boardFrequencies = new Map<string, number>();

    for (const project of this.trelloProjects) {
      for (const card of project.trelloCards) {
        const boardName = card.cardBoardName;
        const frequency = boardFrequencies.get(boardName) || 0;
        boardFrequencies.set(boardName, frequency + 1);
      }
    }

    this.uniqueBoards = Array.from(boardFrequencies.entries()).map(([boardName, frequency]) =>
      new BoardFrequency(boardName, frequency)
    );
  }

  public getTrelloCards(): TrelloCard[] {
    return this.trelloProjects.flatMap(project => project.trelloCards);
  }
}
