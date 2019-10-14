import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'card-countdown[cardSuccess]'
})
export class CardSuccessDirective {
  constructor(element: ElementRef) {
    element.nativeElement.classList.add('card-success');
  }
}
