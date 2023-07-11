import { Component, Input } from '@angular/core';
import { TrelloService } from 'src/app/service/trello.service';

@Component({
  selector: 'trello-card',
  templateUrl: './trello-card.component.html',
  styleUrls: ['./trello-card.component.scss']
})
export class TrelloCardComponent {
  @Input() public cardTitle: string = "";

  constructor(
    public trelloService: TrelloService
  ) { }
}
