import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'card-countdown',
  templateUrl: './card-countdown.component.html',
  styleUrls: ['./card-countdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardCountdownComponent implements OnInit {
  @Input()
  public count: string;

  @Input()
  public description: string;

  ngOnInit(): void {
    if (!this.count) {
      throw new Error('Attribute "count" is required in card component');
    } else if (!this.description) {
      throw new Error('Attribute "description" is required in card component');
    }
  }
}
