import { TrelloCheckListEntries } from './trello-checklist-entries';

export class TrelloCheckList {
  constructor(
    public checklistName: string,
    public checklistEntries: TrelloCheckListEntries[]
  ) { }
}
