import { PipeTransform, Pipe } from '@angular/core';
import { TrelloProject } from '../models/trello/trello-project';

@Pipe({
  name: 'trelloProjectNameFilter',
  pure: false
})
export class TrelloProjectNameFilter implements PipeTransform {
  transform(trelloProjects: TrelloProject[], filter: string): any {
      if (!trelloProjects || !filter) {
          return trelloProjects;
      }

      return trelloProjects.filter(item => item.projectName.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
  }
}
