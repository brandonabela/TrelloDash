import { JsonTrelloAttachment } from './json-trello-attachment';
import { JsonTrelloCardCustomField } from './json-trello-card-custom-field';

export interface JsonTrelloCard {
  id: string;
  name: string;
  desc: string;

  idList: string;
  idLabels: string[];
  idMembers: string[];
  idChecklists: string[];
  attachments: JsonTrelloAttachment[];
  customFieldItems: JsonTrelloCardCustomField[];
}
