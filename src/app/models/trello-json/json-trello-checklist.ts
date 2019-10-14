import { JsonTrelloCheckListEntries } from './json-trello-checklist-entries';

export interface JsonTrelloCheckList {
  id: string;
  name: string;
  checkItems: JsonTrelloCheckListEntries[];
}
