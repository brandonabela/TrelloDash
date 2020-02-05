import { Injectable } from '@angular/core';
import { AlertService } from '../@theme/service/alert.service';
import { messages } from '../constants/messages';
import { JsonStorage } from '../models/local-storage/json-storage';
import { TrelloProject } from '../models/trello/trello-project';

declare var saveAs: any;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private keyTrelloProject = 'trelloProjects';

  constructor(private alertService: AlertService) { }

  // ---------- Reading Memory Handling ----------

  private getStorageValue(key: string): any {
    const storageValue = window.localStorage.getItem(key);

    return storageValue != null ? JSON.parse(storageValue) : null;
  }

  // ---------- Writing Memory Handling ----------

  private setStorageValue(key: string, value: any): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  private addToArray(key: string, value: any): void {
    let storageValue = this.getStorageValue(key);

    if (storageValue === null) {
      storageValue = [];
    }

    storageValue.push(value);

    this.setStorageValue(key, storageValue);
  }

  private removeFromArray(key: string, index: number): void {
    const storageValue = this.getStorageValue(key);
    storageValue.splice(index, 1);

    this.setStorageValue(key, storageValue);
  }

  // ---------- Specific Functionality ----------

  public getTrelloProjects(): TrelloProject[] {
    const trelloProjects = this.getStorageValue(this.keyTrelloProject);

    return trelloProjects != null ? trelloProjects : [];
  }

  public addTrelloProject(trelloProjct: TrelloProject): void {
    this.addToArray(this.keyTrelloProject, trelloProjct);
  }

  public removeTrelloProject(index: number): void {
    this.removeFromArray(this.keyTrelloProject, index);
  }

  // ---------- Import and Export Handling ----------

  public importStorage(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const importJson = JSON.parse(reader.result.toString());
      const jsonStorageKeys = Object.keys(new JsonStorage());

      jsonStorageKeys.map(aStorageKey => {
        if (aStorageKey in importJson) {
          window.localStorage.setItem(aStorageKey, importJson[aStorageKey]);
        }
      });

      this.alertService.add(messages.storageUploadSuccess);
    };
  }

  public exportStorage(): void {
    if (window.localStorage.length > 0) {
      const content = JSON.stringify(window.localStorage);

      const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
      });

      saveAs(blob, 'DS-Config.json');

      this.alertService.add(messages.storageDownloadSuccess);
    } else {
      this.alertService.add(messages.storageDownloadError);
    }
  }
}
