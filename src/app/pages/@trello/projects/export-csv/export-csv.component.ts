import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { TrelloService } from 'src/app/service/trello.service';
import { FormModule } from '../../../../@theme/components/form/form.module';

@Component({
  selector: 'trello-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.scss']
})
export class ExportCsvComponent {
  @Input() public projectIndex!: number;

  public readonly CSV_DELIMITER: Map<string, string> = new Map([
    ['Comma', ','],
    ['Semicolon', ';'],
    ['Tab', '\t'],
    ['Pipe', '|'],
    ['Colon', ':'],
  ]);

  public trelloForm!: UntypedFormGroup;
  public readonly csvDelimiterKeys = Array.from(this.CSV_DELIMITER.keys());

  constructor(
    private alertService: AlertService,
    private trelloService: TrelloService,
    private fb: UntypedFormBuilder
  ) {
    this.trelloForm = this.fb.group({
      csvDelimiter: [Array.from(this.CSV_DELIMITER.keys())[0], [Validators.required]],
      keepBoardName: [true],
      boardName: ['Board Name', [Validators.required]],
      keepCardName: [true],
      cardName: ['Card Name', [Validators.required]],
      keepCardDescription: [true],
      cardDescription: ['Card Description', [Validators.required]],
      keepCardLabels: [true],
      cardLabels: ['Card Labels', [Validators.required]],
      keepCardPercentage: [true],
      cardPercentage: ['Card Percentage', [Validators.required]],
      keepCustomField: [true],
      customField: ['Custom Field', [Validators.required]],
    });

    this.onChanges();
  }

  onChanges(): void {
    FormModule.updateFieldStatus(this.trelloForm, 'keepBoardName', 'boardName');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardName', 'cardName');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardDescription', 'cardDescription');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardLabels', 'cardLabels');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardPercentage', 'cardPercentage');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCustomField', 'customField');
  }

  private getCsvDelimiter(): string {
    const fieldValue = this.trelloForm.controls['csvDelimiter'].value;
    return this.CSV_DELIMITER.get(fieldValue) || '';
  }

  private static formatColumn(value: string = "", delimiter: string = ","): string {
    // Remove any commas in the original string
    value = value.toString().replace(/,/g, '');

    // Replace any occurrences of zero width spaces with an empty string
    value = value.replace(/\u200C/g, '')

    // Replace any newline characters with spaces
    value = value.replace(/\n/g, ' ');

    // Remove markdown syntax
    value = value.replace(/[*_~]/g, '').replace(/\[([^\[\]]*)]\((.*?)\)/gm, '$2');

    // Return formatted column
    return value.includes(delimiter) || value.includes('\n') ? '"' + value + '"' : value;
  }

  private static formatJoinColumns(columns: string[] = [], delimiter: string = ","): string {
    columns = columns.map(column => ExportCsvComponent.formatColumn(column, delimiter));
    return columns.join(delimiter) + '\n';
  }

  public exportCSVProject(): void {
    const csvDelimiter = this.getCsvDelimiter();

    const {
      keepBoardName, boardName,
      keepCardName, cardName,
      keepCardDescription, cardDescription,
      keepCardLabels, cardLabels,
      keepCardPercentage, cardPercentage,
      keepCustomField, customField
    } = this.trelloForm.value;

    if (keepBoardName || keepCardName || keepCardDescription || keepCardLabels || keepCardPercentage || keepCustomField) {
      const trelloProject = this.trelloService.trelloProjects[this.projectIndex];
      const customFieldNames = trelloProject.trelloFieldNames.slice(6);

      const csvHeading = [
        keepBoardName && boardName,
        keepCardName && cardName,
        keepCardDescription && cardDescription,
        keepCardLabels && cardLabels,
        keepCardPercentage && cardPercentage,
        ...(keepCustomField ? customFieldNames.map(fieldName => customField + ' - ' + fieldName) : [])
      ].filter(Boolean);

      let fileString = ExportCsvComponent.formatJoinColumns(csvHeading, csvDelimiter);

      trelloProject.trelloCards.forEach(card => {
        let columns = [
          keepBoardName && card.cardBoardName,
          keepCardName && card.cardName,
          keepCardDescription && card.cardDescription,
          keepCardLabels && card.cardLabels.map(label => label.name).join('\n'),
          keepCardPercentage && card.cardPercentage.toString(),
          ...(keepCustomField && card.cardCustomFields.map(custom => custom.value))
        ].filter(Boolean);

        fileString += ExportCsvComponent.formatJoinColumns(columns, csvDelimiter);
      });

      const blob = new Blob([fileString], {
        type: 'text/plain;charset=utf-8'
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${trelloProject.projectName}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      this.alertService.add(messages.csvDocumentSuccess);
    }
    else {
      this.alertService.add(messages.documentErrorMinOne);
    }
  }
}
