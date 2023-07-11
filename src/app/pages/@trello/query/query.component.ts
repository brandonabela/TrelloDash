import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { TrelloService } from 'src/app/service/trello.service';
import { Pagination } from "../../../@theme/models/pagination";
import { TrelloCard } from 'src/app/models/trello/trello-card';

@Component({
  selector: 'page-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class QueryComponent {
  public sortColumn: string = '';
  public sortDirection: boolean = true;

  public projectNames: string[];
  public boardNames: string[];
  public labelNames: string[];
  public columnNames: string[];

  public projectGroup: FormGroup;
  public boardGroup: FormGroup;
  public labelGroup: FormGroup;
  public columnGroup: FormGroup;

  public advancedFilterKeys: string[];
  public advancedFilterControl: FormControl;

  public pageIndex: number = 1;
  public pageEntries: number = 25;

  public originalCards!: TrelloCard[];
  public filteredCards!: TrelloCard[];

  constructor(
    public trelloService: TrelloService,
    private fb: FormBuilder
  ) {
    this.projectNames = this.getProjectNames();
    this.boardNames = this.getBoardNames();
    this.labelNames = this.getLabelNames();
    this.columnNames = this.getColumnNames();

    this.projectGroup = this.fb.group(new Array(this.projectNames.length).fill(true));
    this.boardGroup = this.fb.group(new Array(this.boardNames.length).fill(true));
    this.labelGroup = this.fb.group(new Array(this.labelNames.length).fill(true));

    const columnGroupValues = this.columnNames.map((_, i) => [0, 1, 2, 5].includes(i));
    this.columnGroup = this.fb.group(columnGroupValues);

    this.advancedFilterKeys = this.columnNames.map(columnName => columnName.replace(' ', '_'));
    this.advancedFilterControl = new FormControl('');

    this.originalCards = this.trelloService.getTrelloCards();
    this.filteredCards = this.originalCards;

    this.sortCards(this.columnNames[0]);
  }

  public getProjectNames(): string[] {
    return this.trelloService.trelloProjects.map(project => project.projectName);
  }

  public getBoardNames(): string[] {
    return this.trelloService.uniqueBoards.map(boardDetails => boardDetails.name);
  }

  public getLabelNames(): string[] {
    const labels = this.trelloService.trelloProjects.flatMap(project =>
      project.trelloCards.flatMap(card => card.cardLabels.map(label => label.name))
    );

    return [...new Set(labels)];
  }

  public getColumnNames(): string[] {
    const trelloProjects = this.trelloService.trelloProjects;

    const allFieldNames = new Set<string>();
    trelloProjects.forEach(project => {
      project.trelloFieldNames.forEach(fieldName => allFieldNames.add(fieldName));
    });

    return [...allFieldNames].filter(fieldName =>
      trelloProjects.every(project => project.trelloFieldNames.includes(fieldName))
    );
  }

  public handleFilterEvent(filteredObjects: TrelloCard[]): void {
    this.filteredCards = filteredObjects;
  }

  public getSelectedColumns(): string[] {
    return this.columnNames.filter((_, index) => this.columnGroup.value[index]);
  }

  public sortCards(sortColumn: string): void {
    if (this.sortColumn == sortColumn) {
      this.sortDirection = !this.sortDirection;
    }
    else {
      this.sortColumn = sortColumn;
      this.sortDirection = true;
    }

    this.filteredCards = this.filteredCards.sort((a: TrelloCard, b: TrelloCard) => {
      const valueA = TrelloCard.getCardPropertyValue(a, this.sortColumn);
      const valueB = TrelloCard.getCardPropertyValue(b, this.sortColumn);

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * (this.sortDirection ? 1 : -1);
      } else {
        return ((valueA as number) - (valueB as number)) * (this.sortDirection ? 1 : -1);
      }
    });
  }

  public getMaxPage(): number {
    return Pagination.getMaxPage(this.pageEntries, this.filteredCards.length);
  }

  public getPages(): number[] {
    return Pagination.getPageWindow(this.pageIndex, this.pageEntries, this.filteredCards.length);
  }

  public setPage(newPageIndex: number): void {
    if (1 <= newPageIndex && newPageIndex <= this.getMaxPage()) {
      this.pageIndex = newPageIndex;
    }
  }

  public boardStatisticsClass(currentIndex: number, total: number): string {
    if (total === 1) {
      return 'col-xl-12';
    }
    else if (total === 2) {
      return 'col-xl-6';
    }
    else if (total === 3 || total === 6) {
      return 'col-xl-4';
    }
    else if (total === 4) {
      return 'col-xl-3';
    }
    else if (total === 5) {
      return (currentIndex <= 3) ? 'col-xl-4' : 'col-xl-6';
    }
    else {
      return (currentIndex <= 4) ? 'col-xl-3' : this.boardStatisticsClass(currentIndex - 4, total - 4);
    }
  }
}
