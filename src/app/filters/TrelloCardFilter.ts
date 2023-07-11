import { Pipe, PipeTransform } from '@angular/core';
import { TrelloCard } from '../models/trello/trello-card';

// TODO: Still require checking once dashboard is fixed

@Pipe({
  name: 'trelloCardFilter',
  pure: false
})
export class TrelloCardFilter implements PipeTransform {
  transform(trelloCards: TrelloCard[], search: string, columns: boolean[], filter: any): TrelloCard[] {
    if (!trelloCards || !search || !columns) {
      filter.length = trelloCards.length;
      return trelloCards;
    }

    search = search.toLowerCase();

    const filterItems = trelloCards.filter(item =>
      (columns[1] && item.cardBoardName.toLowerCase().indexOf(search) >= 0) ||
      (columns[2] && item.cardName.toLowerCase().indexOf(search) >= 0) ||
      (columns[3] && item.cardDescription.toLowerCase().indexOf(search) >= 0) ||
      (columns[4] && item.cardLabels.map(label => label.name.toLowerCase()).filter(label => label.indexOf(search) >= 0).length !== 0) ||
      (columns[5] && (' ' + item.cardPercentage.toString() + '%').indexOf(search) >= 0)
    );

    filter.length = filterItems.length;
    return filterItems;
  }
}
