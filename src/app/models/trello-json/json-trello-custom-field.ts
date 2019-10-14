import { JsonTrelloFieldOptions } from './json-trello-field-options';

export interface JsonTrelloCustomField {
  id: string;
  name: string;
  type: string;
  options: JsonTrelloFieldOptions[];
}
