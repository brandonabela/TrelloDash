import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { RequestService } from 'src/app/service/request.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'page-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public trelloViewer: TrelloViewer;
  public trelloCardFields: string[];

  public projectNameSearch: string;

  public displayColumns: boolean[];
  public defaultDisplayColumns = [0, 1, 2, 5];

  public tableColumnForm: FormGroup;

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService,
    private fb: FormBuilder
  ) {
    this.trelloViewer = new TrelloViewer(this.alertService, this.storageService, this.requestService);

    this.trelloCardFields = this.getCommonFields();
    this.displayColumns = this.trelloCardFields.map(_ => false);

    this.defaultDisplayColumns.forEach(index => {
      this.displayColumns[index] = true;
    });
  }

  ngOnInit() {
    this.tableColumnForm = this.fb.group({
      tableColumnsArray: this.fb.array(this.displayColumns)
    });

    this.onChanges();
  }

  onChanges(): void {
    this.tableColumnForm.valueChanges.subscribe(formValues => {
      this.displayColumns = formValues.tableColumnsArray;
    });
  }

  public getCommonFields(): string[] {
    const projectFields = [].concat(...this.trelloViewer.trelloProjects.map(aProject => aProject.trelloFieldNames));
    const uniqueProjectFields = [...new Set(projectFields)];

    const projectFieldCounts = new Map(uniqueProjectFields
      .map(x => [x, projectFields.filter(y => y === x).length])
    );

    return Array.from(projectFieldCounts)
      .filter(field => field[1] >= this.trelloViewer.trelloProjects.length)
      .map(field => field[0]);
  }

  public boardStatisticsClass(currentIndex: number, total: number): string {
    switch (total) {
      case 1:
        return 'col-xl-12';
      case 2:
        return 'col-xl-6';
      case 3:
        return 'col-xl-4';
      case 4:
        return 'col-xl-3';
      case 5:
        return (currentIndex <= 3) ? 'col-xl-4' : 'col-xl-6';
      case 6:
        return 'col-xl-4';
      default:
        return (currentIndex <= 4) ? 'col-xl-3' : this.boardStatisticsClass(currentIndex - 4, total - 4);
    }
  }

  public noColumnsPresent(): boolean {
    return this.displayColumns.some(item => item);
  }
}
