import { TrelloLabel } from './trello-label';
import { TrelloChecklist } from './trello-checklist';
import { TrelloAttachment } from './trello-attachment';
import { TrelloCustomField } from './trello-custom-field';
import { TrelloCustomDropdown } from './trello-custom-dropdown';

import { JsonTrelloCard } from '../trello-json/json-trello-card';
import { JsonTrelloAttachment } from '../trello-json/json-trello-attachment';
import { JsonTrelloCustomField } from '../trello-json/json-trello-custom-field';
import { JsonTrelloCardCustomField } from '../trello-json/json-trello-card-custom-field';
import { TrelloMember } from './trello-member';

export class TrelloCard {
  public project = '';

  public cardName = '';
  public cardBoardName = '';
  public cardDescription = '';
  public cardLabels: TrelloLabel[] = [];
  public cardMembers: TrelloMember[] = [];

  public cardPercentage = 0;
  public cardLists: TrelloChecklist[] = [];

  public cardAttachments: TrelloAttachment[] = [];
  public cardCustomFields: TrelloCustomField[] = [];

  constructor(
    projectName: string = '',
    jsonTrelloCard: JsonTrelloCard,
    trelloBoards: Map<string, string>,
    trelloLabels: Map<string, TrelloLabel>,
    trelloMembers: Map<string, TrelloMember>,
    trelloChecklists: Map<string, TrelloChecklist>,
    trelloCustomDropdowns: Map<string, TrelloCustomDropdown>,
    jsonCustomFields: JsonTrelloCustomField[] = []
  ) {
    this.project = projectName;
    this.cardName = jsonTrelloCard.name;
    this.cardBoardName = TrelloCard.getBoardName(jsonTrelloCard.idList, trelloBoards);
    this.cardDescription = TrelloCard.getDescription(jsonTrelloCard.desc);
    this.cardLabels = TrelloCard.getLabels(jsonTrelloCard.idLabels, trelloLabels);
    this.cardMembers = TrelloCard.getMembers(jsonTrelloCard.idMembers, trelloMembers);

    this.cardLists = TrelloCard.getChecklists(jsonTrelloCard.idChecklists, trelloChecklists);
    this.cardPercentage = TrelloCard.cardPercentage(this.cardLists);

    this.cardAttachments = TrelloCard.getAttachments(jsonTrelloCard.attachments);
    this.cardCustomFields = TrelloCard.getCustomFields(jsonTrelloCard.customFieldItems, trelloCustomDropdowns, jsonCustomFields);
  }

  private static getBoardName(boardId: string, trelloBoards: Map<string, string>): string {
    return trelloBoards.get(boardId) ?? '';
  }

  private static getDescription(cardDescription: string): string {
    return cardDescription.trim() || 'Empty Description';
  }

  private static getLabels(labelIds: string[], trelloLabels: Map<string, TrelloLabel>): TrelloLabel[] {
    return labelIds.map(cardLabelId => trelloLabels.get(cardLabelId)).filter(Boolean) as TrelloLabel[];
  }

  private static getMembers(memberIds: string[], trelloMembers: Map<string, TrelloMember>): TrelloMember[] {
    return memberIds.map(cardMemberId => trelloMembers.get(cardMemberId)).filter(Boolean) as TrelloMember[];
  }

  private static getChecklists(idChecklists: string[], trelloCheckList: Map<string, TrelloChecklist>): TrelloChecklist[] {
    return idChecklists.map(cardChecklistId => trelloCheckList.get(cardChecklistId)).filter(Boolean) as TrelloChecklist[];
  }

  private static cardPercentage(cardLists: TrelloChecklist[]): number {
    const totalTasks = cardLists.reduce(
      (acc, list) => acc + list.entries.length,
      0
    );

    const completedTasks = cardLists
      .flatMap(list => list.entries)
      .filter(entry => entry.isCompleted).length;

    if (totalTasks === 0) {
      return 0;
    }

    return Math.round((completedTasks / totalTasks) * 10000) / 100;
  }

  private static getAttachments(jsonAttachments: JsonTrelloAttachment[]): TrelloAttachment[] {
    return jsonAttachments.map(attachment => {
      const { name, url, fileName } = attachment;
      return new TrelloAttachment(name.substring(0, name.lastIndexOf('.')), url, fileName);
    });
  }

  private static getCustomFields(
    jsonCardCustomFields: JsonTrelloCardCustomField[],
    trelloCustomDropdowns: Map<string, TrelloCustomDropdown>,
    jsonCustomFields: JsonTrelloCustomField[]
  ): TrelloCustomField[] {
    const cardCustomFields: TrelloCustomField[] = [];

    jsonCustomFields.forEach(customField => {
      const cardCustomField = jsonCardCustomFields.find(c => c.idCustomField === customField.id);

      if (cardCustomField) {
        let value: string = 'Empty Field';

        if (cardCustomField.value !== null) {
          value = Object.values(cardCustomField.value)[0];
        }
        else {
          const dropdown = trelloCustomDropdowns.get(cardCustomField.idCustomField);

          if (dropdown) {
            const option = dropdown.entriesMap.get(cardCustomField.idValue);
            value = option ? Object.values(option)[0] : '';
          }
        }

        cardCustomFields.push(new TrelloCustomField(customField.name, value));
      }
      else {
        cardCustomFields.push(new TrelloCustomField(customField.name, 'Empty Field'));
      }
    });

    return cardCustomFields;
  }

  public static getCardPropertyValue(trelloCard: TrelloCard, key: string): string | number {
    key = key.toLowerCase();

    switch(key) {
      case 'project': return trelloCard.project;
      case 'board': return trelloCard.cardBoardName;
      case 'card name': return trelloCard.cardName;
      case 'card description': return trelloCard.cardDescription;
      case 'card labels': return trelloCard.cardLabels.map((label: TrelloLabel) => label.name).join(', ');
      case 'card percentage': return trelloCard.cardPercentage;
      default: {
        const cardField = trelloCard.cardCustomFields.find(field => field.name === key);
        return cardField ? cardField.value : '';
      }
    }
  }
}
