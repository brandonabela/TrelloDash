import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { FormModule } from '../../../../@theme/components/form/form.module';

declare var saveAs: any;

@Component({
  selector: 'trello-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.scss']
})
export class ExportCsvComponent implements OnInit {
  @Input() public projectIndex: number;
  @Input() public trelloViewer: TrelloViewer;

  public trelloForm: FormGroup;

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder
  ) { }

  static formatDescription(cardDescription: string): string {
    return cardDescription.replace(/[*_~]/g, '').replace(/\[([^\[\]]*)]\((.*?)\)/gm, '$2').replace(/[\r\n]+/g, '\n');
  }

  ngOnInit() {
    this.trelloForm = this.fb.group({
      csvDelimiter: ['Comma', Validators.required],
      chkBoardName: [true, Validators.required],
      txtBoardName: ['Board Name', Validators.required],
      chkCardName: [true, Validators.required],
      txtCardName: ['Card Name', Validators.required],
      chkCardDescription: [true, Validators.required],
      txtCardDescription: ['Description', Validators.required],
      chkCardLabels: [true, Validators.required],
      txtCardLabels: ['Labels', Validators.required],
      chkCardPercentage: [true, Validators.required],
      txtCardPercentage: ['List Progress', Validators.required],
      chkCustomField: [true, Validators.required],
      txtCustomField: ['Custom Field', Validators.required],
    });

    this.onChanges();
  }

  onChanges(): void {
    FormModule.updateFieldStatus(this.trelloForm, 'chkBoardName', 'txtBoardName');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardName', 'txtCardName');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardDescription', 'txtCardDescription');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardLabels', 'txtCardLabels');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardPercentage', 'txtCardPercentage');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCustomField', 'txtCustomField');
  }

  private getCsvDelimiter(): string {
    const fieldValue = this.trelloForm.get('csvDelimiter').value;

    return fieldValue === 'Tab' ? '\t' : fieldValue === 'Semicolon' ? ';' : fieldValue === 'Comma' ? ',' : fieldValue === 'Space' ? ' ' : ',';
  }

  private formatColumns(csvColumns: string[], csvDelimiter: string): string[] {
    return csvColumns.map(column => column.includes(csvDelimiter) || column.includes('\n') ? '"' + column + '"' : column);
  }

  public exportCSVProject(): void {
    const csvDelimiter = this.getCsvDelimiter();

    const chkBoardName = this.trelloForm.get('chkBoardName').value;
    const txtBoardName = this.trelloForm.get('txtBoardName').value;
    const chkCardName = this.trelloForm.get('chkCardName').value;
    const txtCardName = this.trelloForm.get('txtCardName').value;
    const chkCardDescription = this.trelloForm.get('chkCardDescription').value;
    const txtCardDescription = this.trelloForm.get('txtCardDescription').value;
    const chkCardLabels = this.trelloForm.get('chkCardLabels').value;
    const txtCardLabels = this.trelloForm.get('txtCardLabels').value;
    const chkCardPercentage = this.trelloForm.get('chkCardPercentage').value;
    const txtCardPercentage = this.trelloForm.get('txtCardPercentage').value;
    const chkCustomField = this.trelloForm.get('chkCustomField').value;
    const txtCustomField = this.trelloForm.get('txtCustomField').value;

    const trelloProject = this.trelloViewer.trelloProjects[this.projectIndex];

    const cardLength = trelloProject.trelloCards.length;
    const customFieldNames = trelloProject.trelloFieldNames.slice(6);

    if (!chkBoardName && !chkCardName && !chkCardDescription && !chkCardLabels && !chkCardPercentage && !chkCustomField) {
      this.alertService.add(messages.documentErrorMinOne);
      return;
    }

    if (
      (chkBoardName && !txtBoardName.length) || (chkCardName && !txtCardName.length) || (chkCardDescription && !txtCardDescription.length) ||
      (chkCardLabels && !txtCardLabels.length) || (chkCardPercentage && txtCardPercentage.length) || (chkCustomField && txtCustomField.length)
    ) {
      this.alertService.add(messages.documentErrorString);
      return;
    }

    let csvHeading = [
      (chkBoardName ? txtBoardName : ''),
      (chkCardName ? txtCardName : ''),
      (chkCardDescription ? txtCardDescription : ''),
      (chkCardLabels ? txtCardLabels : ''),
      (chkCardPercentage ? txtCardPercentage : ''),
      (chkCustomField ? customFieldNames.map(fieldName => txtCustomField + ' - ' + fieldName) : '')
    ];

    csvHeading = [].concat(...csvHeading).filter(item => item !== '');
    csvHeading = this.formatColumns(csvHeading, csvDelimiter);

    let fileString = csvHeading.join(csvDelimiter);

    for (let i = 0; i < cardLength; i++) {
      let columns = [
        chkBoardName ? trelloProject.trelloCards[i].cardBoardName : '',
        chkCardName ? trelloProject.trelloCards[i].cardName : '',
        chkCardDescription ? ExportCsvComponent.formatDescription(trelloProject.trelloCards[i].cardDescription) : '',
        chkCardLabels ? trelloProject.trelloCards[i].cardLabels.map(label => label.labelName).join('\n') : '',
        chkCardPercentage ? trelloProject.trelloCards[i].cardPercentage + '' : '',
        chkCustomField ? trelloProject.trelloCards[i].cardCustomFields.map(custom => custom.fieldValue) : ''
      ];

      columns = [].concat(...columns).filter(item => item !== '');
      columns = this.formatColumns(columns as string[], csvDelimiter);

      fileString += '\n' + columns.join(csvDelimiter);
    }

    const blob = new Blob([fileString], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(blob, trelloProject.projectName + '.csv');

    this.alertService.add(messages.csvDocumentSuccess);
  }
}
