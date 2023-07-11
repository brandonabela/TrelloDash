import { JsonTrelloCustomField } from "../trello-json/json-trello-custom-field";

export class TrelloCustomDropdown {
  public readonly name: string = "";
  public readonly entriesMap: Map<string, string> = new Map();

  constructor(jsonCustomField: JsonTrelloCustomField) {
    this.name = jsonCustomField.name;

    this.entriesMap = new Map<string, string>(
      jsonCustomField.options.map(anOption => [anOption.id, anOption.value])
    );
  }
}
