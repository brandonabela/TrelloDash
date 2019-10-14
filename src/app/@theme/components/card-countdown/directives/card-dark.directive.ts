import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'card-countdown[cardDark]'
})
export class CardDarkDirective {
  constructor(element: ElementRef) {
    element.nativeElement.classList.add('card-dark');
  }
}
