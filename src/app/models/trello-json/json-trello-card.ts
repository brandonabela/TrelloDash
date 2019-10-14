import { JsonTrelloAttachment } from './json-trello-attachment';
import { JsonTrelloCardCustomField } from './json-trello-card-custom-field';

export class JsonTrelloCard {
  id: string;
  name: string;
  desc: string;

  idList: string;
  idLabels: string[];
  idChecklists: string[];
  attachments: JsonTrelloAttachment[];
  customFieldItems: JsonTrelloCardCustomField[];
}
