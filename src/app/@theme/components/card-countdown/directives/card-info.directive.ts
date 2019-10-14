import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'card-countdown[cardInfo]'
})
export class CardInfoDirective {
  constructor(element: ElementRef) {
    element.nativeElement.classList.add('card-info');
  }
}
