import { Component, Input } from '@angular/core';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';

@Component({
  selector: 'trello-card',
  templateUrl: './trello-card.component.html',
  styleUrls: ['./trello-card.component.scss']
})
export class TrelloCardComponent {
  @Input() public cardTitle: string;
  @Input() public trelloViewer: TrelloViewer;
}
