import { Component } from '@angular/core';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';
import { TrelloAttachment } from 'src/app/models/trello/trello-attachment';
import { TrelloCheckList } from 'src/app/models/trello/trello-checklist';
import { TrelloProject } from 'src/app/models/trello/trello-project';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { RequestService } from 'src/app/service/request.service';
import { StorageService } from 'src/app/service/storage.service';

declare var JSZip: any;
declare var saveAs: any;

@Component({
  selector: 'page-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  public exportPercentage = 0;

  public trelloViewer: TrelloViewer;

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService
  ) {
    this.trelloViewer = new TrelloViewer(this.alertService, this.storageService, this.requestService);
  }

  public exportTrelloProject(index: number) {
    const selectedProject = this.trelloViewer.getTrelloProject(index);

    const fileString = this.generateDocumentString(selectedProject);

    this.exportDocumentation(selectedProject, fileString);
  }

  private generateDocumentString(selectedProject: TrelloProject): string {
    let fileString =
      '%----------------------------------------------------------------------------------------\n' +
      '%\t\t\tCHAPTER\n' +
      '%----------------------------------------------------------------------------------------\n' +
      '\n' +
      '\\begin{document}\n' +
      '\n' +
      '\\chapter{Trello Documentation}\n\n';

    selectedProject.trelloCards.map((aCard, cardIndex) => {
      fileString += '\\begin{longtabu}{|X|XX|} \\hline \\tabuphantomline\n';

      fileString += this.getCardRow('Name', this.escapeCharacters(aCard.cardName));
      fileString += this.getCardRow('Description', this.formatCardDescription(this.escapeCharacters(aCard.cardDescription)));

      if (aCard.cardLabels.length !== 0) {
        let selectedLabels = '';

        aCard.cardLabels.map((aCardLabel, i) => {
          selectedLabels += aCardLabel.labelName + ((i !== aCard.cardLabels.length - 1) ? ', ' : '');
        });

        fileString += this.getCardRow('Label', this.escapeCharacters(selectedLabels));
      }

      if (aCard.cardCustomFields.length !== 0) {
        aCard.cardCustomFields.map(aCardCustomField => {
          fileString += this.getCardRow(
            this.escapeCharacters(aCardCustomField.fieldName),
            this.escapeCharacters(aCardCustomField.fieldValue)
          );
        });
      }

      aCard.cardLists.map(aCardList => {
        let useTwoColumn = true;

        aCardList.checklistEntries.map(aChecklistEntry => {
          if (aChecklistEntry.taskName.length > 40 && useTwoColumn) {
            useTwoColumn = false;
          }
        });

        fileString += this.formatCardChecklist(aCardList, useTwoColumn);
      });

      fileString += '\\end{longtabu}';

      if (aCard.cardAttachments.length !== 0) {
        fileString += '\n';

        aCard.cardAttachments.map((aCardAttachment, attachmentIndex) => {
          fileString += '\n\\begin{figure}[ht!]\n';
          fileString += '\t\\centering \n';
          fileString += '\t\\includegraphics[width=\\linewidth / 4 * 3]{images/GameTasks/' + this.escapeCharacters(aCardAttachment.cardAttachmentName) + '} \n';
          fileString += '\\end{figure} \n';
          fileString += '\\vspace*{1.5cm}';

          fileString += ((attachmentIndex !== aCard.cardAttachments.length - 1) ? '\n' : '');
        });
      }

      fileString += ((cardIndex < selectedProject.trelloCards.length - 1) ? '\n\n\\clearpage\n\n' : '\n\n\\end{document}\n');
    });

    return fileString;
  }

  private escapeCharacters(unformattedString: string): string {
    const escapeRegex = /(&|%|\$|#|_|{|}|~|\^|\\)/g;

    return unformattedString.replace(escapeRegex, '\\$1');
  }

  private getCardRow(rowName: string, rowContent: string): string {
    return (
      '\t' + (rowName + ':').padEnd(25) +
      '& \\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{' + rowContent + ' \\newline} \\\\ \\hline \n'
    );
  }

  private formatCardDescription(cardDescription: string): string {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const newLineRegex = /[\r\n]+/g;
    const urlRegex = /((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?)/g;

    return cardDescription
      .replace(boldRegex, '\\textbf{$1}')
      .replace(newLineRegex, ' \\newline ')
      .replace(urlRegex, '\\textbf{\\textit{\\href{$1}{$1}}}');
  }

  private formatCardChecklist(trelloCheckList: TrelloCheckList, useTwoColumn: boolean): string {
    let latexChecklist = '\t' + (trelloCheckList.checklistName + ':').padEnd(25) + '& ';

    if (useTwoColumn) {
      trelloCheckList.checklistEntries.map((aChecklistEntry, index) => {
        latexChecklist += (((index !== 0) && (index % 2) === 0) ? '\t\t\t\t\t\t\t & ' : '');
        latexChecklist += '\\begin{todolist} ';

        latexChecklist += ((aChecklistEntry.isTaskCompleted) ? '\\item[\\done] ' : '\\item ');
        latexChecklist += this.escapeCharacters(aChecklistEntry.taskName);
        latexChecklist += ' \\end{todolist}' + (((index % 2) === 0) ? ' & ' : ' \\\\ \n');
      });
    } else {
      latexChecklist += '\\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{';
      latexChecklist += '\n\t\\begin{todolist}\n';

      trelloCheckList.checklistEntries.map((aChecklistEntry, index) => {
        latexChecklist += ((aChecklistEntry.isTaskCompleted) ? '\t\t\\item[\\done] ' : '\t\t\\item ');
        latexChecklist += this.escapeCharacters(aChecklistEntry.taskName);
        latexChecklist += ((index !== trelloCheckList.checklistEntries.length - 1) ? ' \\\\ \n' : '');
      });

      latexChecklist += '\n\t\\end{todolist}}';
    }

    return latexChecklist + ' \\\\ \\hline \n';
  }

  private getAttachments(selectedProject: TrelloProject) {
    return [].concat(...selectedProject.trelloCards
      .filter(aCard => aCard.cardAttachments.length)
      .map(aCard => aCard.cardAttachments.map(anAttachment => anAttachment))
    );
  }

  private exportDocumentation(selectedProject: TrelloProject, fileString: string): void {
    const zip = new JSZip();

    const imageFolder = 'images/';
    const texFileName = 'trelloDocument.tex';
    const zipFileName = 'trelloDocument.zip';

    const projectAttachments = this.getAttachments(selectedProject);

    const blob = new Blob([fileString], {
      type: 'text/plain;charset=utf-8'
    });

    if (projectAttachments.length !== 0) {
      let currentAttachment = 0;

      zip.file(texFileName, blob, { type: 'octet/stream' });
      this.exportPercentage = (((currentAttachment + 1) / (projectAttachments.length + 1)) * 100);

      projectAttachments.map((anAttachment: TrelloAttachment) => {
        this.requestService.getBase64WithCors(anAttachment.cardAttachmentLink).then(attachmentBase64 => {
          zip.file(imageFolder + anAttachment.cardAttachmentNameWithExtension, attachmentBase64, { base64: true });

          currentAttachment++;

          this.exportPercentage = ((currentAttachment / (projectAttachments.length + 1)) * 100);

          if (currentAttachment === projectAttachments.length) {
            zip.generateAsync({ type: 'blob' }).then(content => {
              saveAs(content, zipFileName);

              this.exportPercentage = 0;
              this.alertService.add(messages.zipDocumentSuccess);
            });
          }
        });
      });
    } else {
      saveAs(blob, texFileName);

      this.exportPercentage = 0;
      this.alertService.add(messages.texDocumentSuccess);
    }
  }
}
