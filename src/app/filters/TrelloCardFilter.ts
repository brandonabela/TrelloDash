import { Pipe, PipeTransform } from '@angular/core';
import { TrelloCard } from '../models/trello/trello-card';

@Pipe({
  name: 'trelloCardFilter',
  pure: false
})
export class TrelloCardFilter implements PipeTransform {
  transform(trelloCards: TrelloCard[], filter: string): any {
    if (!trelloCards || !filter) {
      return trelloCards;
    }

    return trelloCards.filter(item => item.cardName.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }
}
