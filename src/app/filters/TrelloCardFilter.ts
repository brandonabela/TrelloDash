import { Pipe, PipeTransform } from '@angular/core';
import { TrelloCard } from '../models/trello/trello-card';

@Pipe({
  name: 'trelloCardFilter',
  pure: false
})
export class TrelloCardFilter implements PipeTransform {
  transform(trelloCards: TrelloCard[], args: string[]): any {
    const argKeys = Object.keys(args);

    const filterKey = argKeys[0];
    const columnKey = argKeys[1];

    let filter = args[filterKey];
    const columns = args[columnKey];

    if (!trelloCards || !filter || !columns) {
      return trelloCards;
    }

    filter = filter.toLowerCase();

    return trelloCards.filter(item =>
      (columns[1] && item.cardBoardName.toLowerCase().indexOf(filter) >= 0) ||
      (columns[2] && item.cardName.toLowerCase().indexOf(filter) >= 0) ||
      (columns[3] && item.cardDescription.toLowerCase().indexOf(filter) >= 0) ||
      (columns[4] && item.cardLabels.map(label => label.labelName.toLowerCase()).filter(label => label.indexOf(filter) >= 0).length !== 0) ||
      (columns[5] && (' ' + item.cardPercentage.toString() + '%').indexOf(filter) >= 0)
    );
  }
}
