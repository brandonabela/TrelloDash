import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'card-countdown[cardPrimary]'
})
export class CardPrimaryDirective {
  constructor(element: ElementRef) {
    element.nativeElement.classList.add('card-primary');
  }
}
