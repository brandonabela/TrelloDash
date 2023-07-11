import { Pipe, PipeTransform } from '@angular/core';
import { TrelloProject } from '../models/trello/trello-project';

// TODO: Still require checking once dashboard is fixed

@Pipe({
  name: 'trelloProjectFilter',
  pure: false
})
export class TrelloProjectFilter implements PipeTransform {
  transform(trelloProjects: TrelloProject[], filter: string): any {
    if (!trelloProjects || !filter) {
      return trelloProjects;
    }

    return trelloProjects.filter(item => item.projectName.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }
}
