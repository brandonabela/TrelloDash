import { JsonTrello } from '../trello-json/json-trello';
import { JsonTrelloBoard } from "../trello-json/json-trello-board";
import { JsonTrelloLabel } from "../trello-json/json-trello-label";
import { JsonTrelloMember } from "../trello-json/json-trello-member";
import { JsonTrelloCheckList } from "../trello-json/json-trello-checklist";
import { JsonTrelloCustomField } from "../trello-json/json-trello-custom-field";

import { TrelloMember } from './trello-member';
import { TrelloCard } from './trello-card';
import { TrelloLabel } from './trello-label';
import { TrelloChecklist } from './trello-checklist';
import { TrelloCustomDropdown } from './trello-custom-dropdown';

export class TrelloProject {
  public projectName: string;
  public projectLink: string;
  public projectJson: string;
  public projectMembers: TrelloMember[];

  public renewalPeriod: number = 0;
  public expiryDate: Date = new Date();

  public trelloCards: TrelloCard[] = [];

  public trelloBoards: Map<string, string> = new Map<string, string>();
  public trelloLabels: Map<string, TrelloLabel> = new Map<string, TrelloLabel>();
  public trelloMembers: Map<string, TrelloMember> = new Map<string, TrelloMember>();
  public trelloChecklists: Map<string, TrelloChecklist> = new Map<string, TrelloChecklist>();
  public trelloCustomDropdowns: Map<string, TrelloCustomDropdown> = new Map<string, TrelloCustomDropdown>();

  public trelloFieldNames: string[] = [];

  constructor(projectJson: JsonTrello, days: number) {
    const jsonCustomFields: JsonTrelloCustomField[] = projectJson.customFields;

    this.projectName = projectJson.name;
    this.projectLink = projectJson.shortUrl;
    this.projectJson = projectJson.shortUrl + '.json';

    this.trelloMembers = TrelloProject.getMembers(projectJson.members);
    this.projectMembers = Array.from(this.trelloMembers.values());

    this.setRenewalPeriod(days);

    this.trelloBoards = TrelloProject.getBoards(projectJson.lists);
    this.trelloLabels = TrelloProject.getLabels(projectJson.labels);
    this.trelloChecklists = TrelloProject.getChecklists(projectJson.checklists);
    this.trelloCustomDropdowns = TrelloProject.getCustomDropdown(projectJson.customFields);

    this.trelloFieldNames = TrelloProject.getFieldNames(jsonCustomFields);

    this.trelloCards = projectJson.cards.map(card =>
      new TrelloCard(
        this.projectName, card, this.trelloBoards, this.trelloLabels, this.trelloMembers, this.trelloChecklists,
        this.trelloCustomDropdowns, jsonCustomFields
      )
    );
  }

  public setRenewalPeriod(days: number): void {
    this.renewalPeriod = days;

    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + days);
    this.expiryDate = todayDate;
  }

  private static getMembers(jsonMembers: JsonTrelloMember[]): Map<string, TrelloMember> {
    return new Map<string, TrelloMember>(
      jsonMembers.map(aJsonMember => [aJsonMember.id, new TrelloMember(aJsonMember)])
    );
  }

  private static getBoards(jsonLists: JsonTrelloBoard[]): Map<string, string> {
    return new Map<string, string>(
      jsonLists.map(aJsonList => [aJsonList.id, aJsonList.name])
    );
  }

  private static getLabels(jsonLabels: JsonTrelloLabel[]): Map<string, TrelloLabel> {
    return new Map<string, TrelloLabel>(
      jsonLabels.map(aJsonLabel => [aJsonLabel.id, new TrelloLabel(aJsonLabel)])
    );
  }

  private static getChecklists(jsonChecklists: JsonTrelloCheckList[]): Map<string, TrelloChecklist> {
    return new Map<string, TrelloChecklist>(
      jsonChecklists.map(aChecklist => [aChecklist.id, new TrelloChecklist(aChecklist)])
    );
  }

  private static getCustomDropdown(jsonCustomFields: JsonTrelloCustomField[]): Map<string, TrelloCustomDropdown> {
    return new Map<string, TrelloCustomDropdown>(
      jsonCustomFields
        .filter(aCustomField => aCustomField.type === 'list')
        .map(aCustomField => [aCustomField.id, new TrelloCustomDropdown(aCustomField)])
    );
  }

  private static getFieldNames(jsonCustomFields: JsonTrelloCustomField[]): string[] {
    const fieldsNames = ['Project', 'Board', 'Card Name', 'Card Description', 'Card Labels', 'Card Percentage'];

    if (jsonCustomFields.length > 0) {
      return [...fieldsNames, ...jsonCustomFields.map(aCustomField => aCustomField.name)];
    }

    return fieldsNames;
  }
}
