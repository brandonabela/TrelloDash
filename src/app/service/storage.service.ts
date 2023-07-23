import { Injectable } from '@angular/core';

import { messages } from '../constants/messages';

import { AlertService } from '../@theme/service/alert.service';
import { JsonStorage } from '../models/local-storage/json-storage';
import { TrelloProject } from '../models/trello/trello-project';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static JSON_OBJECT = JSON;

  private trelloProjects: TrelloProject[] = [];
  private keyTrelloProject: string = 'trelloProjects';

  constructor(
    private alertService: AlertService
  ) {
    this.trelloProjects = StorageService.getStorageValue<TrelloProject[]>(this.keyTrelloProject) || [];
  }

  // ---------- Read and Write Functionality ----------

  private static getStorageValue<T>(key: string): T | null {
    const storageValue = window.localStorage.getItem(key);

    try {
      return StorageService.JSON_OBJECT.parse(storageValue ?? "null") as T;
    } catch (error) {
      console.error(`Error parsing storage value for key ${key}: ${error}`);
      return null;
    }
  }

  private static setStorageValue<T>(key: string, value: T[]): void {
    window.localStorage.setItem(key, StorageService.JSON_OBJECT.stringify(value));
  }

  private static updateArray<T>(key: string, value: T, index?: number): void {
    const storageValue = StorageService.getStorageValue<T[]>(key) ?? [];

    if (index !== undefined && storageValue[index] !== undefined) {
      storageValue[index] = value;
    } else {
      storageValue.push(value);
    }

    StorageService.setStorageValue(key, storageValue);
  }

  private static removeFromArray<T>(key: string, index: number): void {
    const storageValue = StorageService.getStorageValue<T[]>(key) || [];
    storageValue.splice(index, 1);
    StorageService.setStorageValue(key, storageValue);
  }

  // ---------- Specific Functionality ----------

  public getTrelloProjects(): TrelloProject[] {
    return this.trelloProjects;
  }

  public addTrelloProject(trelloProject: TrelloProject): TrelloProject[] {
    StorageService.updateArray<TrelloProject>(this.keyTrelloProject, trelloProject);
    this.trelloProjects.push(trelloProject);
    return this.trelloProjects;
  }

  public updateTrelloProject(index: number, trelloProject: TrelloProject): TrelloProject[] {
    StorageService.updateArray<TrelloProject>(this.keyTrelloProject, trelloProject, index);
    this.trelloProjects[index] = trelloProject;
    return this.trelloProjects;
  }

  public removeTrelloProject(index: number): TrelloProject[] {
    StorageService.removeFromArray(this.keyTrelloProject, index);
    this.trelloProjects.splice(index, 1);
    return this.trelloProjects;
  }

  public clearTrelloStorage(): void {
    StorageService.setStorageValue(this.keyTrelloProject, []);
  }

  // ---------- Import and Export Handling ----------

  public importStorage(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      if (reader.result) {
        const importJson = JSON.parse(reader.result.toString());

        const jsonStorageKeys = Object.keys(new JsonStorage());

        for (const aStorageKey of jsonStorageKeys) {
          if (aStorageKey in importJson) {
            window.localStorage.setItem(aStorageKey, importJson[aStorageKey]);
          }
        }

        location.reload();

        alert('Storage upload successful.');
      } else {
        console.error('Error: FileReader result is null.');
      }
    };
  }

  public exportStorage(filename: string = 'DS-Config.json'): void {
    if (window.localStorage.length === 0) {
      this.alertService.add(messages.storageDownloadError);
      return;
    }

    const content = JSON.stringify(window.localStorage);
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    this.alertService.add(messages.storageDownloadSuccess);
  }
}
