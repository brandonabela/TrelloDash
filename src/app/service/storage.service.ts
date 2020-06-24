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

  // ---------- JSON Map Handling ----------

  private compress(key: string, value: any) {
    const originalObject = this[key];

    if (originalObject instanceof Map) {
      return {
        dataType: 'Map',
        value: [...originalObject]
      };
    } else {
      return value;
    }
  }

  private decompress(key: string, value: any) {
    if (typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }

    return value;
  }

  // ---------- Reading Memory Handling ----------

  private getStorageValue(key: string): any {
    const storageValue = window.localStorage.getItem(key);

    return storageValue != null ? JSON.parse(storageValue, this.decompress) : null;
  }

  // ---------- Writing Memory Handling ----------

  private setStorageValue(key: string, value: any): void {
    window.localStorage.setItem(key, JSON.stringify(value, this.compress));
  }

  private addToArray(key: string, value: any): void {
    let storageValue = this.getStorageValue(key);

    if (storageValue === null) {
      storageValue = [];
    }

    storageValue.push(value);

    this.setStorageValue(key, storageValue);
  }

  private updateArrayValue(key: string, index: number, value: any): void {
    const storageValue = this.getStorageValue(key);
    storageValue[index] = value;

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

  public addTrelloProject(trelloProject: TrelloProject): void {
    this.addToArray(this.keyTrelloProject, trelloProject);
  }

  public updateTrelloProject(index: number, trelloProject: TrelloProject): void {
    this.updateArrayValue(this.keyTrelloProject, index, trelloProject);
  }

  public removeTrelloProject(index: number): void {
    this.removeFromArray(this.keyTrelloProject, index);
  }

  // ---------- Import and Export Handling ----------

  public importStorage(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      const importJson = JSON.parse(reader.result.toString(), this.decompress);
      const jsonStorageKeys = Object.keys(new JsonStorage());

      jsonStorageKeys.map(aStorageKey => {
        if (aStorageKey in importJson) {
          window.localStorage.setItem(aStorageKey, importJson[aStorageKey]);
        }
      });

      location.reload();

      this.alertService.add(messages.storageUploadSuccess);
    };
  }

  public exportStorage(): void {
    if (window.localStorage.length > 0) {
      const content = JSON.stringify(window.localStorage, this.compress);

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
