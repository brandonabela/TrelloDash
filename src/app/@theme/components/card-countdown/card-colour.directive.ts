import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[cardColour]'
})
export class CardColourDirective implements OnInit {
  @Input('cardColour') colour!: string;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.colour) {
      const firstChild = this.elementRef.nativeElement.firstElementChild;
      firstChild.classList.add(`card-${this.colour}`);
    }
  }
}
