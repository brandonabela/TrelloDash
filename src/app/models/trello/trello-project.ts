import { JsonTrello } from '../trello-json/json-trello';
import { TrelloCard } from './trello-card';
import { TrelloCheckList } from './trello-checklist';
import { TrelloCheckListEntries } from './trello-checklist-entries';
import { TrelloCustomDropdown } from './trello-custom-dropdown';
import { TrelloLabel } from './trello-label';

export class TrelloProject {

  public projectName: string;
  public projectLink: string;
  public projectJson: string;
  public trelloCards: TrelloCard[] = [];

  public validInDays: number;
  public expiryDate: Date;

  public trelloBoards: Map<string, string> = new Map<string, string>();
  public trelloLabelList: Map<string, TrelloLabel> = new Map<string, TrelloLabel>();
  public trelloCheckList: Map<string, TrelloCheckList> = new Map<string, TrelloCheckList>();
  public trelloCustomDropdown: Map<string, TrelloCustomDropdown> = new Map<string, TrelloCustomDropdown>();

  constructor(projectJson: JsonTrello, days: number) {
    this.projectName = projectJson.name;
    this.projectLink = projectJson.shortUrl;
    this.projectJson = projectJson.shortUrl + '.json';

    this.validInDays = days;
    this.expiryDate = TrelloProject.getExpiryDate(days);

    this.trelloBoards = TrelloProject.addTrelloBoards(projectJson);
    this.trelloCheckList = TrelloProject.addTrelloChecklists(projectJson);
    this.trelloLabelList = TrelloProject.addTrelloLabels(projectJson);
    this.trelloCustomDropdown = TrelloProject.addCustomDropdown(projectJson);

    // Add Cards

    for (let i = 0; i < projectJson.cards.length; i++) {
      this.trelloCards.push(new TrelloCard(projectJson, i, this.trelloBoards, this.trelloCheckList, this.trelloLabelList, this.trelloCustomDropdown));
    }
  }

  public static getExpiryDate(days: number): Date {
    const todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + days);

    return todayDate;
  }

  private static addTrelloBoards(projectJson: JsonTrello): Map<string, string> {
    const trelloBoards: Map<string, string> = new Map<string, string>();

    projectJson.lists.map(aBoard => trelloBoards.set(aBoard.id, aBoard.name));

    return trelloBoards;
  }

  private static addTrelloLabels(projectJson: JsonTrello): Map<string, TrelloLabel> {
    const trelloLabelList: Map<string, TrelloLabel> = new Map<string, TrelloLabel>();

    projectJson.labels.map(aLabel => trelloLabelList.set(aLabel.id, new TrelloLabel(aLabel.name, aLabel.color)));

    return trelloLabelList;
  }

  private static addTrelloChecklists(projectJson: JsonTrello): Map<string, TrelloCheckList> {
    const trelloCheckList: Map<string, TrelloCheckList> = new Map<string, TrelloCheckList>();

    projectJson.checklists.map(aChecklist =>
      trelloCheckList.set(
        aChecklist.id,
        new TrelloCheckList(
          aChecklist.name,
          aChecklist.checkItems.map(aCheckItem => new TrelloCheckListEntries(aCheckItem.name, (aCheckItem.state === 'complete')))
        )
      )
    );

    return trelloCheckList;
  }

  private static addCustomDropdown(projectJson: JsonTrello): Map<string, TrelloCustomDropdown> {
    const trelloFieldList: Map<string, TrelloCustomDropdown> = new Map<string, TrelloCustomDropdown>();

    projectJson.customFields
      .filter(aCustomField => aCustomField.type === 'list')
      .map(aCustomField => trelloFieldList.set(
        aCustomField.id,
        new TrelloCustomDropdown(
          aCustomField.name,
          new Map<string, string>(
            aCustomField.options.map(anOption =>
              [anOption.id, anOption.value]
            )
          )
        )
      ));

    return trelloFieldList;
  }
}
