import { JsonTrelloCheckList } from '../trello-json/json-trello-checklist';
import { TrelloChecklistEntries } from './trello-checklist-entries';

export class TrelloChecklist {
  public readonly name: string = "";
  public readonly entries: TrelloChecklistEntries[] = [];

  constructor(jsonTrelloChecklist: JsonTrelloCheckList) {
    this.name = jsonTrelloChecklist.name;
    this.entries = jsonTrelloChecklist.checkItems.map(aCheckItem => new TrelloChecklistEntries(aCheckItem));
  }
}
