import { JsonTrelloLabel } from "../trello-json/json-trello-label";

export class TrelloLabel {
  private static colorMap = new Map([
    ['black', '#355263'],
    ['blue', '#0079BF'],
    ['green', '#61BD4F'],
    ['lime', '#51E898'],
    ['orange', '#FF9F1A'],
    ['pink', '#FF78CB'],
    ['purple', '#C377E0'],
    ['red', '#EB5A46'],
    ['sky', '#00C2E0'],
    ['yellow', '#F2D600'],
  ]);

  public readonly name: string = '';
  public readonly colour: string = '';

  constructor(jsonLabel: JsonTrelloLabel) {
    this.name = jsonLabel.name;
    this.colour = TrelloLabel.colorMap.get(jsonLabel.color.toLowerCase()) || '#B3BEC4';
  }
}
