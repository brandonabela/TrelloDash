import { JsonTrelloCheckListEntries } from "../trello-json/json-trello-checklist-entries";

export class TrelloChecklistEntries {
  public readonly entry: string = "";
  public readonly isCompleted: boolean = false;

  constructor(jsonTrelloChecklistEntries: JsonTrelloCheckListEntries) {
    this.entry = jsonTrelloChecklistEntries.name;
    this.isCompleted = jsonTrelloChecklistEntries.state === 'complete';
  }
}
