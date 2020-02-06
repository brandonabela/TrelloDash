import { Component, Input } from '@angular/core';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';

@Component({
  selector: 'trello-page-logic',
  templateUrl: './page-logic.component.html',
  styleUrls: ['./page-logic.component.scss']
})
export class PageLogicComponent {
  @Input()
  public cardTitle: string;

  @Input()
  public trelloViewer: TrelloViewer;
}
