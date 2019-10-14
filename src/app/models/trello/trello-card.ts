import { JsonTrello } from '../trello-json/json-trello';
import { JsonTrelloAttachment } from '../trello-json/json-trello-attachment';
import { TrelloAttachment } from './trello-attachment';
import { TrelloCheckList } from './trello-checklist';
import { TrelloCustomDropdown } from './trello-custom-dropdown';
import { TrelloCustomField } from './trello-custom-field';
import { TrelloLabel } from './trello-label';

export class TrelloCard {
  public cardBoardName = '';
  public cardName = '';
  public cardDescription = '';
  public cardLabels: TrelloLabel[] = [];

  public cardPercentage = 0;
  public cardLists: TrelloCheckList[] = [];

  public cardAttachments: TrelloAttachment[] = [];
  public cardCustomFields: TrelloCustomField[] = [];

  constructor(projectJson: JsonTrello, cardIndex: number, trelloBoards: Map<string, string>, trelloCheckList: Map<string, TrelloCheckList>, trelloLabelList: Map<string, TrelloLabel>, trelloCustomDropdown: Map<string, TrelloCustomDropdown>) {
    this.cardBoardName = trelloBoards.get(projectJson.cards[cardIndex].idList);
    this.cardName = projectJson.cards[cardIndex].name;
    this.cardDescription = projectJson.cards[cardIndex].desc.length > 0 ? projectJson.cards[cardIndex].desc : 'Empty Description';
    this.cardLabels = TrelloCard.getCardLabels(projectJson.cards[cardIndex].idLabels, trelloLabelList);

    this.cardLists = TrelloCard.getCheckLists(projectJson.cards[cardIndex].idChecklists, trelloCheckList);
    this.cardPercentage = this.cardLists.length !== 0 ? TrelloCard.calculatePercentage(this.cardLists) : 0;

    this.cardAttachments = TrelloCard.getCardAttachments(projectJson.cards[cardIndex].attachments);
    this.cardCustomFields = TrelloCard.getCustomFields(projectJson, trelloCustomDropdown, cardIndex);
  }

  private static getCardLabels(cardLabelIds: string[], trelloLabelList: Map<string, TrelloLabel>): TrelloLabel[] {
    return cardLabelIds.map(cardLabelId => trelloLabelList.get(cardLabelId));
  }

  private static getCheckLists(cardCheckListIds: string[], trelloCheckList: Map<string, TrelloCheckList>): TrelloCheckList[] {
    return cardCheckListIds.map(cardChecklistId => trelloCheckList.get(cardChecklistId));
  }

  private static calculatePercentage(cardCheckLists: TrelloCheckList[]): number {
    let completedTasks = 0;
    let checklistEntriesTotal = 0;

    cardCheckLists.forEach(aChecklist => {
      aChecklist.checklistEntries.forEach(aChecklistEntry => {
        if (aChecklistEntry.isTaskCompleted) {
          completedTasks++;
        }

        checklistEntriesTotal++;
      });
    });

    const cardPercentage = (completedTasks / checklistEntriesTotal) * 100; // Calculate card percentage
    return Math.round(cardPercentage * 100) / 100; // Round to two decimal places
  }

  private static getCustomFields(projectJson: JsonTrello, trelloFieldList: Map<string, TrelloCustomDropdown>, cardIndex: number): TrelloCustomField[] {
    const cardCustomFields: TrelloCustomField[] = [];

    projectJson.customFields.forEach(aCustomField => {
      let isFieldSet = false;

      projectJson.cards[cardIndex].customFieldItems.forEach(aCardCustomField => {
        if (aCustomField.id === aCardCustomField.idCustomField) {
          // If custom field is a dropdown

          if (aCardCustomField.value === undefined) {
            const customFieldMap = trelloFieldList.get(aCardCustomField.idCustomField).dropdownChoices;
            const selectedOption = customFieldMap.get(aCardCustomField.idValue);

            cardCustomFields.push(new TrelloCustomField(aCustomField.name, Object.values(selectedOption)[0]));
          } else {
            cardCustomFields.push(new TrelloCustomField(aCustomField.name, Object.values(aCardCustomField.value)[0]));
          }

          isFieldSet = true;
        }
      });

      if (!isFieldSet) {
        cardCustomFields.push(new TrelloCustomField(aCustomField.name, 'Empty Field'));
      }
    });

    return cardCustomFields;
  }

  private static getCardAttachments(cardAttachmentsJson: JsonTrelloAttachment[]): TrelloAttachment[] {
    return cardAttachmentsJson.map(cardAttachment =>
      new TrelloAttachment(
        cardAttachment.name.substring(0, cardAttachment.name.lastIndexOf('.')),
        cardAttachment.name,
        cardAttachment.url
      )
    );
  }
}
