import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { EvaluateExpression } from 'src/app/@theme/models/expression';
import { TrelloCard } from 'src/app/models/trello/trello-card';

@Component({
  selector: 'textarea-autocomplete',
  templateUrl: './textarea-autocomplete.component.html',
  styleUrls: ['./textarea-autocomplete.component.scss']
})
export class TextareaAutocompleteComponent {
  public lineNumbers: number[] = [1];
  public userInteraction: boolean = false;
  public showAutocomplete: boolean = false;

  public dropdownTop: number = 0;
  public dropdownLeft: number = 0;
  public dropdownValues: string[] = [];

  public logical: string[] = ['AND', 'OR'];
  public operators: string[] = ['=', '!=', '~', '!~', '>', '>=', '<', '<='];

  @ViewChild('textareaField') textareaField!: ElementRef;
  private textareaElement!: HTMLTextAreaElement;

  private textWidthElement!: HTMLSpanElement;

  @Input() keys!: string[];
  @Input() originalObjects!: TrelloCard[];
  @Input() elementFormControl!: UntypedFormControl;
  @Output() filterEvent = new EventEmitter<TrelloCard[]>();

  constructor() {
    this.textWidthElement = document.createElement('span');
    document.body.appendChild(this.textWidthElement);
  }

  ngAfterViewInit(): void {
    this.textareaElement = this.textareaField.nativeElement;
  }

  setUserInteraction(userInteraction: boolean) {
    this.userInteraction = userInteraction;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (
      !this.textareaField.nativeElement.contains(targetElement) &&
      targetElement.tagName !== 'LI'
    ) {
      this.setUserInteraction(false);
    }
  }

  private calculateTextWidth(textareaText: string): number {
    this.textWidthElement.style.position = 'absolute';
    this.textWidthElement.style.visibility = 'hidden';
    this.textWidthElement.style.font = getComputedStyle(this.textareaElement).font;
    this.textWidthElement.textContent = textareaText;

    return this.textWidthElement.getBoundingClientRect().width;
  }

  private getCursorIndex(): number {
    return this.textareaElement.selectionStart;
  }

  private getCursorTokens(): string[] {
    const cursorIndex = this.getCursorIndex();
    const textareaValue = this.elementFormControl.value;

    const tokens = EvaluateExpression.getTokens(textareaValue);
    const cursorTokens = EvaluateExpression.filterTokens(tokens, cursorIndex);
    return cursorTokens;
  }

  private setLineNumbers(): void {
    const textareaValue = this.elementFormControl.value;
    const newLineCount = textareaValue.split(/\r?\n/).length;

    this.lineNumbers = Array(newLineCount).fill(0).map((_, i) => i + 1);
  }

  private setDropdownValues(cursorTokens: string[]): void {
    const cursorIndex = this.getCursorIndex();
    const textareaValue = this.elementFormControl.value;

    const predictNext = textareaValue[cursorIndex - 1] === ' ';
    const numOfTokens = cursorTokens.length + (predictNext ? 1 : 0);

    if (numOfTokens % 4 === 1) {
      this.dropdownValues = this.keys;
    }
    else if (numOfTokens % 4 === 2) {
      this.dropdownValues = this.operators;
    }
    else if (numOfTokens % 4 === 3) {
      const operatorToken = cursorTokens.map(token => this.operators.includes(token));
      const operatorIndices = operatorToken.flatMap((value, index) => value ? [index] : []);
      const maxOperatorIndex = Math.max(...operatorIndices);

      const keyValue = cursorTokens[maxOperatorIndex - 1];
      const propertyValues = EvaluateExpression.getPropertyValues(this.originalObjects, keyValue);
      this.dropdownValues = propertyValues;
    }
    else {
      this.dropdownValues = this.logical;
    }

    if (!predictNext) {
      const currentToken = cursorTokens[cursorTokens.length - 1].toLowerCase();
      this.dropdownValues = this.dropdownValues.filter(value => value.toLowerCase().includes(currentToken));
    }
  }

  private setDropdownPosition(): void {
    const textareaValue = this.elementFormControl.value;

    const cursorIndex = this.getCursorIndex();
    const cursorLineIndex = textareaValue.lastIndexOf('\n', cursorIndex - 1) + 1;

    const cursorNewLines = textareaValue.slice(0, cursorIndex).split('\n').length - 1;
    const currentLine = textareaValue.slice(cursorLineIndex, cursorIndex);

    this.dropdownTop = 45 + (cursorNewLines * 19);
    this.dropdownLeft = 60 + this.calculateTextWidth(currentLine);
  }

  public trackKeyUp(): void {
    const textareaValue = this.elementFormControl.value;

    const cursorTokens = this.getCursorTokens();
    this.showAutocomplete = cursorTokens.length > 0;

    this.setLineNumbers();

    if (this.showAutocomplete) {
      this.setDropdownValues(cursorTokens);
      this.setDropdownPosition();

      const expression = EvaluateExpression.build(textareaValue);

      if (expression != null) {
        const filteredObjects = this.originalObjects.filter(original => EvaluateExpression.evaluate(expression, original));
        this.filterEvent.emit(filteredObjects);
      }
    }
    else {
      this.filterEvent.emit(this.originalObjects);
    }
  }

  public dropdownClick(clickedItem: string) {
    const textareaValue = this.elementFormControl.value;

    const cursorIndex = this.getCursorIndex();
    const cursorStartPosition = textareaValue.lastIndexOf(' ', cursorIndex - 1) + 1;
    const cursorEndPosition = textareaValue.indexOf(' ', cursorIndex);

    const preToken = textareaValue.substring(0, cursorStartPosition);
    const postToken = textareaValue.substring(cursorEndPosition !== -1 ? cursorEndPosition : textareaValue.length);
    this.elementFormControl.setValue(preToken + clickedItem + ' ' + postToken);

    this.trackKeyUp();
  }
}
