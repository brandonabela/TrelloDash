import { Component, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { messages } from 'src/app/constants/messages';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { RequestService } from 'src/app/service/request.service';
import { TrelloService } from 'src/app/service/trello.service';

import { FormModule } from "../../../../@theme/components/form/form.module";
import { TrelloAttachment } from '../../../../models/trello/trello-attachment';
import { TrelloChecklist } from '../../../../models/trello/trello-checklist';
import { TrelloProject } from '../../../../models/trello/trello-project';
import { TrelloChecklistEntries } from 'src/app/models/trello/trello-checklist-entries';

import * as JSZip from 'jszip';

@Component({
  selector: 'trello-export-latex',
  templateUrl: './export-latex.component.html',
  styleUrls: ['./export-latex.component.scss']
})
export class ExportLatexComponent {
  @Input() public projectIndex!: number;

  public trelloForm!: UntypedFormGroup;

  constructor(
    private alertService: AlertService,
    private requestService: RequestService,
    private trelloService: TrelloService,
    private fb: UntypedFormBuilder
  ) {
    this.trelloForm = this.fb.group({
      chapterName: ['Trello Documentation', [Validators.required]],
      keepBoardName: [true],
      boardName: ['Board Name', [Validators.required]],
      keepCardName: [true],
      cardName: ['Card Name', [Validators.required]],
      keepCardDescription: [true],
      cardDescription: ['Description', [Validators.required]],
      keepCardLabels: [true],
      cardLabels: ['Labels', [Validators.required]],
      keepCardLists: [true],
      keepCustomField: [true],
      keepCardAttachment: [true],
      cardAttachmentPath: ['images/', [Validators.required]]
    });

    this.onChanges();
  }

  onChanges(): void {
    FormModule.updateFieldStatus(this.trelloForm, 'keepBoardName', 'boardName');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardName', 'cardName');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardDescription', 'cardDescription');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardLabels', 'cardLabels');
    FormModule.updateFieldStatus(this.trelloForm, 'keepCardAttachment', 'cardAttachmentPath');
  }

  public getFileHeader(chapterName: string): string {
    return [
      '\\documentclass{book}',
      '',
      '\\usepackage{tabu}',
      '\\usepackage{hyperref}',
      '\\usepackage{longtable}',
      '\\usepackage{graphicx}',
      '',
      '\\usepackage{enumitem,amssymb}',
      '\\newlist{todolist}{itemize}{2}',
      '\\setlist[todolist]{label=$\\square$}',
      '',
      '\\usepackage[a4paper, total={6in, 8in}]{geometry}',
      '',
      '\\begin{document}',
      '',
      '\\chapter{' + chapterName + '}\n\n'
    ].join('\n');
  }

  private static escapeCharacters(value: string): string {
    const escapeRegex = /[$&%{}_^~\\]/g;
    const unicodeRegex = /[^\x00-\x7F]/g;

    const boldRegex = /#+\s([^\n]*)|\*\*(.*?)\*\*/g;
    const italicRegex = /_(.*?)_/g;
    const strikeRegex = /~~(.*?)~~/g;
    const newLineRegex = /[\r\n]+/g;

    const urlRegex = /\[([^\[\]]*)]\((.*?)\)|^(https?:\/\/[^\s/$.?#][^\s]*)$/g;
    const urlMarkRegex = /\[([^\[\]]*)]\((.*?)\)/g;
    const urlPlaceRegex = /LINKPLACEHOLDER(\d+)/g;

    value = value.replace(unicodeRegex, '');

    const linkPlaceholders: string[] = [];
    value = value.replace(urlRegex, (match, _) => {
      linkPlaceholders.push(match);
      return `LINKPLACEHOLDER${linkPlaceholders.length - 1}`;
    });

    value = value
      .replace(escapeRegex, '\\$&')

      .replace(boldRegex, '\\textbf{$1}')
      .replace(italicRegex, '\\textit{$1}')
      .replace(strikeRegex, '\\sout{$1}')
      .replace(newLineRegex, ' \\newline ');

    value = value.replace(urlPlaceRegex, (_, p1) => {
      let url = linkPlaceholders[p1].replace(/%&/g, '\\$&');

      if (url.match(urlMarkRegex)) {
        return url.replace(urlRegex, (_, p1, p2) => {
          p1 = p1.replace(escapeRegex, '\\$&');
          p2 = p2.replace(escapeRegex, '\\$&');
          return `\\textbf{\\href{${p2}}{${p1}}}`;
        });
      }
      else {
        url = url.replace(escapeRegex, '\\$&');
        return `\\textbf{\\href{${url}}{${url}}}`;
      }
    });

    return value;
  }

  private static latexTableRow(rowName: string, rowContent: string): string {
    const escapedName = (ExportLatexComponent.escapeCharacters(rowName) + ':').padEnd(25);
    const escapedContent = ExportLatexComponent.escapeCharacters(rowContent);

    return `\t${escapedName}& \\multicolumn{2}{p{\\dimexpr 20pt + 2 \\tabucolX + 2 \\arrayrulewidth}|}{${escapedContent} \\newline} \\\\ \\hline\n`;
  }

  public latexCardChecklist(trelloCheckList: TrelloChecklist): string {
    const checklistName = ExportLatexComponent.escapeCharacters(trelloCheckList.name);
    const useTwoColumn = trelloCheckList.entries.some(entry => entry.entry.length < 40);
    let latexChecklist = '\t' + (checklistName + ':').padEnd(25) + '& ';

    const processChecklistEntry = (entry: TrelloChecklistEntries) => {
      latexChecklist += `\n\t\t${entry.isCompleted ? '$\\boxtimes$ ' : '$\\square$ '}`;
      latexChecklist += ExportLatexComponent.escapeCharacters(entry.entry);
      latexChecklist += ' \\newline';
    };

    if (useTwoColumn) {
      const splitIndex = Math.ceil(trelloCheckList.entries.length / 2);
      const [firstColumnEntries, secondColumnEntries] = [
        trelloCheckList.entries.slice(0, splitIndex),
        trelloCheckList.entries.slice(splitIndex)
      ];

      firstColumnEntries.forEach(processChecklistEntry);
      latexChecklist += '\n\t&'
      secondColumnEntries.forEach(processChecklistEntry);
    } else {
      latexChecklist += '\\multicolumn{2}{p{\\dimexpr 20pt+2\\tabucolX+2\\arrayrulewidth}|}{\n';
      trelloCheckList.entries.forEach(processChecklistEntry);
      latexChecklist += '\n\t}';
    }

    return latexChecklist + ' \\\\ \\hline \n';
  }

  private latexCardAttachments(cardAttachments: TrelloAttachment[], cardAttachmentPath: string): string {
    cardAttachmentPath += cardAttachmentPath.endsWith('/') ? '' : '/';

    return cardAttachments.map(aCardAttachment => [
      '\n\\begin{figure}[ht!]',
      '\t\\centering',
      `\t\\includegraphics[width=0.75 \\linewidth]{${cardAttachmentPath}${ExportLatexComponent.escapeCharacters(aCardAttachment.name)}}`,
      '\\end{figure}\n',
      '\\vspace*{1cm}'
    ].join('\n')
    ).join('\n');
  }

  private static projectAttachments(trelloProject: TrelloProject): TrelloAttachment[] {
    return trelloProject.trelloCards.flatMap(aCard => aCard.cardAttachments);
  }

  private exportFiles(trelloProject: TrelloProject, fileString: string, keepCardAttachment: boolean = true, cardAttachmentPath: string = 'images/'): void {
    const texFileName = trelloProject.projectName + '.tex';
    const zipFileName = trelloProject.projectName + '.zip';

    cardAttachmentPath += cardAttachmentPath.endsWith('/') ? '' : '/';
    const projectAttachments = ExportLatexComponent.projectAttachments(trelloProject);

    const blob = new Blob([fileString], {
      type: 'text/plain;charset=utf-8'
    });

    if (keepCardAttachment && projectAttachments.length !== 0) {
      this.alertService.add(messages.trelloInitDownload);

      const zip = new JSZip();
      zip.file(texFileName, blob);

      let attachmentLoaded = 0;

      projectAttachments.forEach((anAttachment: TrelloAttachment) => {
        this.requestService.getResponseWithCors(anAttachment.link).subscribe((attachment: ArrayBuffer) => {
          zip.file(cardAttachmentPath + anAttachment.fileName, attachment, { base64: true });

          attachmentLoaded ++;

          if (attachmentLoaded == projectAttachments.length) {
            zip.generateAsync({ type: 'blob' })
              .then((content: Blob) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(content);
                a.download = zipFileName;
                a.click();

                this.alertService.add(messages.zipDocumentSuccess);
              })
              .catch((error: Error) => {
                this.alertService.add(messages.zipDocumentError);
              });
          }
        });
      });
    }
    else {
      const zip = new Blob([blob], { type: 'octet/stream' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zip);
      link.download = texFileName;
      link.click();

      this.alertService.add(messages.texDocumentSuccess);
    }
  }

  public exportLatexProject(): void {
    const {
      chapterName,
      keepBoardName, boardName,
      keepCardName, cardName,
      keepCardDescription, cardDescription,
      keepCardLabels, cardLabels,
      keepCardLists, keepCustomField,
      keepCardAttachment, cardAttachmentPath
    } = this.trelloForm.value;

    if (keepBoardName || keepCardName || keepCardDescription || keepCardLabels || keepCardLists || keepCustomField || keepCardAttachment) {
      const trelloProject = this.trelloService.trelloProjects[this.projectIndex];

      let fileString = this.getFileHeader(chapterName);

      trelloProject.trelloCards.forEach((aCard, cardIndex) => {
        fileString += '\\begin{longtabu}{|X|XX|} \\hline \\tabuphantomline\n';
        fileString += keepCardName ? ExportLatexComponent.latexTableRow(cardName, aCard.cardName) : '';
        fileString += keepBoardName ? ExportLatexComponent.latexTableRow(boardName, aCard.cardBoardName) : '';
        fileString += keepCardDescription ? ExportLatexComponent.latexTableRow(cardDescription, aCard.cardDescription) : '';

        if (keepCardLabels) {
          const cardLabelJoin = aCard.cardLabels.length ? aCard.cardLabels.map(aCardLabel => aCardLabel.name).join(', ') : 'No Labels';
          fileString += ExportLatexComponent.latexTableRow(cardLabels, cardLabelJoin);
        }

        if (keepCustomField) {
          for (const aCardCustomField of aCard.cardCustomFields) {
            fileString += ExportLatexComponent.latexTableRow(aCardCustomField.name, aCardCustomField.value);
          }
        }

        if (keepCardLists) {
          for (const aCardList of aCard.cardLists) {
            fileString += this.latexCardChecklist(aCardList);
          }
        }

        fileString += '\\end{longtabu}\n';

        if (keepCardAttachment) {
          fileString += this.latexCardAttachments(aCard.cardAttachments, cardAttachmentPath);
        }

        fileString += ((cardIndex < trelloProject.trelloCards.length - 1) ? '\n\n\\clearpage\n\n' : '\n\n\\end{document}\n');
      });

      this.exportFiles(trelloProject, fileString, keepCardAttachment, cardAttachmentPath);
    }
    else {
      this.alertService.add(messages.documentErrorMinOne);
    }
  }
}
