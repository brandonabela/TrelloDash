import { JsonTrelloBoard } from './json-trello-board';
import { JsonTrelloCard } from './json-trello-card';
import { JsonTrelloCheckList } from './json-trello-checklist';
import { JsonTrelloCustomField } from './json-trello-custom-field';
import { JsonTrelloLabel } from './json-trello-label';
import { JsonTrelloMember } from './json-trello-member';

export interface JsonTrello {
  name: string;
  shortUrl: string;
  members: JsonTrelloMember[];

  cards: JsonTrelloCard[];
  lists: JsonTrelloBoard[];
  labels: JsonTrelloLabel[];
  checklists: JsonTrelloCheckList[];
  customFields: JsonTrelloCustomField[];
}
