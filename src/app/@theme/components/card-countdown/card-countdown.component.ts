import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-countdown',
  templateUrl: './card-countdown.component.html',
  styleUrls: ['./card-countdown.component.scss']
})
export class CardCountdownComponent {
  @Input() count?: number = 0;
  @Input() description?: string = "";
}
