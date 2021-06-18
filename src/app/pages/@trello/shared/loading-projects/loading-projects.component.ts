import { Component, Input } from '@angular/core';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';

@Component({
  selector: 'trello-loading-projects',
  templateUrl: './loading-projects.component.html',
  styleUrls: ['./loading-projects.component.scss']
})
export class LoadingProjectsComponent {
  @Input() public trelloViewer: TrelloViewer;
}
