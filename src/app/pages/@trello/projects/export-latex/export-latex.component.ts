import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { FormModule } from '../../../../@theme/components/form/form.module';
import { TrelloAttachment } from '../../../../models/trello/trello-attachment';
import { TrelloCheckList } from '../../../../models/trello/trello-checklist';
import { TrelloCustomField } from '../../../../models/trello/trello-custom-field';
import { TrelloLabel } from '../../../../models/trello/trello-label';
import { TrelloProject } from '../../../../models/trello/trello-project';
import { RequestService } from '../../../../service/request.service';

declare var JSZip: any;
declare var saveAs: any;

@Component({
  selector: 'trello-export-latex',
  templateUrl: './export-latex.component.html',
  styleUrls: ['./export-latex.component.scss']
})
export class ExportLatexComponent implements OnInit {
  @Input() public projectIndex: number;
  @Input() public trelloViewer: TrelloViewer;

  public trelloForm: FormGroup;

  constructor(
    private alertService: AlertService,
    private requestService: RequestService,
    private fb: FormBuilder
  ) { }

  static escapeCharacters(noFormatString: string): string {
    return noFormatString.replace(/([&%$#_{}~^\\])/g, '\\$1');
  }

  static latexTableRow(rowName: string, rowContent: string): string {
    return (
      '\t' + (rowName + ':').padEnd(25) +
      '& \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{' + rowContent + ' \\newline} \\\\ \\hline \n'
    );
  }

  static formatCardDescription(cardDescription: string): string {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const italicRegex = /_(.*?)_/g;
    const strikeRegex = /~~(.*?)~~/g;
    const newLineRegex = /[\r\n]+/g;
    const urlRegex = /\[([^\[\]]*)]\((.*?)\)/gm;

    return cardDescription
      .replace(boldRegex, '\\textbf{$1}')
      .replace(italicRegex, '\\textit{$1}')
      .replace(strikeRegex, '\\sout{$1}')
      .replace(newLineRegex, ' \\newline ')
      .replace(urlRegex, '\\textbf{\\textit{\\href{$1}{$2}}}');
  }

  static getAttachments(selectedProject: TrelloProject) {
    return [].concat(...selectedProject.trelloCards
      .filter(aCard => aCard.cardAttachments.length)
      .map(aCard => aCard.cardAttachments.map(anAttachment => anAttachment))
    );
  }

  ngOnInit() {
    this.trelloForm = this.fb.group({
      txtChapterName: ['Trello Documentation', Validators.required],
      chkBoardName: [true, Validators.required],
      txtBoardName: ['Board Name', Validators.required],
      chkCardName: [true, Validators.required],
      txtCardName: ['Card Name', Validators.required],
      chkCardDescription: [true, Validators.required],
      txtCardDescription: ['Description', Validators.required],
      chkCardLabels: [true, Validators.required],
      txtCardLabels: ['Labels', Validators.required],
      chkCardLists: [true, Validators.required],
      chkCustomField: [true, Validators.required],
      chkCardAttachment: [true, Validators.required]
    });

    this.onChanges();
  }

  onChanges(): void {
    FormModule.updateFieldStatus(this.trelloForm, 'chkBoardName', 'txtBoardName');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardName', 'txtCardName');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardDescription', 'txtCardDescription');
    FormModule.updateFieldStatus(this.trelloForm, 'chkCardLabels', 'txtCardLabels');
  }

  public exportLatexProject(): void {
    const trelloProject = this.trelloViewer.trelloProjects[this.projectIndex];
    const fileString = this.generateLatexString(trelloProject);
    this.exportLatexFile(trelloProject, fileString);
  }

  public getFileHeader(txtChapterName: string): string {
    return [
      '%----------------------------------------------------------------------------------------',
      '%\t\t\tCHAPTER',
      '%----------------------------------------------------------------------------------------',
      '',
      '\\begin{document}',
      '',
      '\\chapter{' + txtChapterName + '}\n',
    ].join('\n');
  }

  public getSelectedLabels(cardLabels: TrelloLabel[]): string {
    return cardLabels.map(aCardLabel => aCardLabel.labelName).join(', ');
  }

  public getCustomFields(cardCustomFields: TrelloCustomField[]): string {
    return cardCustomFields.map(aCardCustomField => {
      ExportLatexComponent.latexTableRow(
        ExportLatexComponent.escapeCharacters(aCardCustomField.fieldName),
        ExportLatexComponent.escapeCharacters(aCardCustomField.fieldValue)
      );
    }).join('');
  }

  public getCardLists(cardLists: TrelloCheckList[]): string {
    return cardLists.map(aCardList => {
      let useTwoColumn = true;

      aCardList.checklistEntries.map(aChecklistEntry => {
        if (aChecklistEntry.taskName.length > 40 && useTwoColumn) {
          useTwoColumn = false;
        }
      });

      this.formatCardChecklist(aCardList, useTwoColumn);
    }).join('');
  }

  private formatCardChecklist(trelloCheckList: TrelloCheckList, useTwoColumn: boolean): string {
    let latexChecklist = '\t' + (trelloCheckList.checklistName + ':').padEnd(25) + '& ';

    if (useTwoColumn) {
      trelloCheckList.checklistEntries.map((aChecklistEntry, index) => {
        latexChecklist += (((index !== 0) && (index % 2) === 0) ? '\t\t\t\t\t\t\t & ' : '');
        latexChecklist += '\\begin{todolist} ';

        latexChecklist += ((aChecklistEntry.isTaskCompleted) ? '\\item[\\done] ' : '\\item ');
        latexChecklist += ExportLatexComponent.escapeCharacters(aChecklistEntry.taskName);
        latexChecklist += ' \\end{todolist}' + (((index % 2) === 0) ? ' & ' : ' \\\\ \n');
      });
    } else {
      latexChecklist += '\\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{';
      latexChecklist += '\n\t\\begin{todolist}\n';

      trelloCheckList.checklistEntries.map((aChecklistEntry, index) => {
        latexChecklist += ((aChecklistEntry.isTaskCompleted) ? '\t\t\\item[\\done] ' : '\t\t\\item ');
        latexChecklist += ExportLatexComponent.escapeCharacters(aChecklistEntry.taskName);
        latexChecklist += ((index !== trelloCheckList.checklistEntries.length - 1) ? ' \\\\ \n' : '');
      });

      latexChecklist += '\n\t\\end{todolist}}';
    }

    return latexChecklist + ' \\\\ \\hline \n';
  }

  public getCardAttachments(cardAttachments: TrelloAttachment[]): string {
    return cardAttachments.map(aCardAttachment => [
      '\n\\begin{figure}[ht!]',
      '\t\\centering',
      '\t\\includegraphics[width=\\linewidth / 4 * 3]{images/GameTasks/' + ExportLatexComponent.escapeCharacters(aCardAttachment.cardAttachmentName) + '}',
      '\end{figure}',
      '\\vspace*{1.5cm}'
    ].join('\n')
    ).join('\n');
  }

  private generateLatexString(trelloProject: TrelloProject): string {
    const txtChapterName = this.trelloForm.get('txtChapterName').value;

    const chkBoardName = this.trelloForm.get('chkBoardName').value;
    const txtBoardName = this.trelloForm.get('txtBoardName').value;
    const chkCardName = this.trelloForm.get('chkCardName').value;
    const txtCardName = this.trelloForm.get('txtCardName').value;
    const chkCardDescription = this.trelloForm.get('chkCardDescription').value;
    const txtCardDescription = this.trelloForm.get('txtCardDescription').value;
    const chkCardLabels = this.trelloForm.get('chkCardLabels').value;
    const txtCardLabels = this.trelloForm.get('txtCardLabels').value;
    const chkCardLists = this.trelloForm.get('chkCardLists').value;
    const chkCustomField = this.trelloForm.get('chkCustomField').value;
    const chkCardAttachment = this.trelloForm.get('chkCardAttachment').value;

    if (!chkBoardName && !chkCardName && !chkCardDescription && !chkCardLabels && !chkCardLists && !chkCustomField && !chkCardAttachment) {
      this.alertService.add(messages.documentErrorMinOne);
      return;
    }

    if (
      (chkBoardName && !txtBoardName.length) || (chkCardName && !txtCardName.length) ||
      (chkCardDescription && !txtCardDescription.length) || (chkCardLabels && !txtCardLabels.length)
    ) {
      this.alertService.add(messages.documentErrorString);
      return;
    }

    let fileString = this.getFileHeader(txtChapterName);

    trelloProject.trelloCards.map((aCard, cardIndex) => {
      fileString += '\\begin{longtabu}{|X|XX|} \\hline \\tabuphantomline\n';

      const cardName = ExportLatexComponent.escapeCharacters(aCard.cardName);
      fileString += chkCardName ? ExportLatexComponent.latexTableRow(txtCardName, cardName) : '';

      const boardName = ExportLatexComponent.escapeCharacters(aCard.cardBoardName);
      fileString += chkBoardName ? ExportLatexComponent.latexTableRow(txtBoardName, boardName) : '';

      const cardDescription = ExportLatexComponent.formatCardDescription(ExportLatexComponent.escapeCharacters(aCard.cardDescription));
      fileString += chkCardDescription ? ExportLatexComponent.latexTableRow(txtCardDescription, cardDescription) : '';

      if (aCard.cardLabels.length !== 0) {
        const cardLabels = ExportLatexComponent.escapeCharacters(this.getSelectedLabels(aCard.cardLabels));
        fileString += chkCardLabels ? ExportLatexComponent.latexTableRow(txtCardLabels, cardLabels) : '';
      }

      if (aCard.cardCustomFields.length !== 0) {
        fileString += chkCustomField ? this.getCustomFields(aCard.cardCustomFields) : '';
      }

      fileString += chkCardLists ? this.getCardLists(aCard.cardLists) : '';
      fileString += '\\end{longtabu}';

      if (aCard.cardAttachments.length !== 0) {
        fileString += chkCardAttachment ? '\n' + this.getCardAttachments(aCard.cardAttachments) : '';
      }

      fileString += ((cardIndex < trelloProject.trelloCards.length - 1) ? '\n\n\\clearpage\n\n' : '\n\n\\end{document}\n');
    });

    return fileString;
  }

  private exportLatexFile(selectedProject: TrelloProject, fileString: string): void {
    const zip = new JSZip();

    const imageFolder = 'images/';
    const texFileName = selectedProject.projectName + '.tex';
    const zipFileName = selectedProject.projectName + '.zip';

    const chkCardAttachment = this.trelloForm.get('chkCardAttachment').value;
    const projectAttachments = ExportLatexComponent.getAttachments(selectedProject);

    const blob = new Blob([fileString], {
      type: 'text/plain;charset=utf-8'
    });

    if (chkCardAttachment && projectAttachments.length !== 0) {
      this.alertService.add(messages.trelloInitDownload);

      let currentAttachment = 0;

      zip.file(texFileName, blob, { type: 'octet/stream' });

      projectAttachments.map((anAttachment: TrelloAttachment) => {
        this.requestService.getBase64WithCors(anAttachment.cardAttachmentLink).then(attachmentBase64 => {
          zip.file(imageFolder + anAttachment.cardAttachmentNameWithExtension, attachmentBase64, { base64: true });
          currentAttachment++;

          if (currentAttachment === projectAttachments.length) {
            zip.generateAsync({ type: 'blob' }).then(content => {
              saveAs(content, zipFileName);

              this.alertService.add(messages.zipDocumentSuccess);
            });
          }
        });
      });
    } else {
      saveAs(blob, texFileName);

      this.alertService.add(messages.texDocumentSuccess);
    }
  }
}
