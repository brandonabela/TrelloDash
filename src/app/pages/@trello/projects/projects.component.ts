import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrelloService } from 'src/app/service/trello.service';
import { ChartOptions } from "../../../config/chart-options";

@Component({
  selector: 'page-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public trelloForm: FormGroup;
  public projectIndex: number = 0;

  public readonly EXPIRY_TYPES = [
    { value: 1, label: 'Days' },
    { value: 31, label: 'Months' },
    { value: 365, label: 'Years' }
  ];

  private readonly DEFAULT_FORM_VALUES = {
    url: '',
    expiryQuantity: 1,
    expiryType: this.EXPIRY_TYPES[0].value
  };

  private boardSummary: Map<string, number> = new Map();
  public boardDataset: any[] = [];
  public boardLabels: string[] = [];

  private cardSummary: Map<string, number> = new Map();
  public cardDataset: any[] = [];
  public cardLabels: string[] = [];

  private memberSummary: Map<string, number> = new Map();
  public memberDataset: any[] = [];
  public memberLabels: string[] = [];

  public chartOptions = ChartOptions.getChartOptions();

  constructor(
    public trelloService: TrelloService,
    private fb: FormBuilder
  ) {
    this.trelloForm = this.fb.group({
      url: ['', [Validators.required, Validators.minLength(8)]],
      expiryQuantity: [1, [Validators.required, Validators.min(1)]],
      expiryType: [this.EXPIRY_TYPES[0].value, Validators.required]
    });
  }

  ngOnInit() {
    this.boardSummary = this.getBoardSummary();
    this.boardDataset = [{ data: Array.from(this.boardSummary.values()) }];
    this.boardLabels = Array.from(this.boardSummary.keys());

    this.cardSummary = this.getCardSummary();
    this.cardDataset = [{ data: Array.from(this.cardSummary.values()) }];
    this.cardLabels = Array.from(this.cardSummary.keys());

    this.memberSummary = this.getMemberSummary();
    this.memberDataset = [{ data: Array.from(this.memberSummary.values()) }];
    this.memberLabels = Array.from(this.memberSummary.keys());
  }

  private getCardSummary(): Map<string, number> {
    const cardCounts = new Map<string, number>();

    for (const project of this.trelloService.trelloProjects) {
      const count = cardCounts.get(project.projectName) ?? 0;
      cardCounts.set(project.projectName, count + project.trelloCards.length);
    }

    return cardCounts;
  }

  public getBoardSummary(): Map<string, number> {
    const boardCounts = new Map<string, number>();

    for (const project of this.trelloService.trelloProjects) {
      for (const card of project.trelloCards) {
        const count = boardCounts.get(card.cardBoardName) ?? 0;
        boardCounts.set(card.cardBoardName, count + 1);
      }
    }

    return boardCounts;
  }

  public getMemberSummary(): Map<string, number> {
    const memberCounts = new Map<string, number>();

    for (const project of this.trelloService.trelloProjects) {
      for (const member of project.projectMembers) {
        const count = memberCounts.get(member.fullName) ?? 0;
        memberCounts.set(member.fullName, count + 1);
      }
    }

    return memberCounts;
  }

  public getExpiryType(expiryDays: number): number {
    if (expiryDays === 0) {
      return 1;
    }

    const isMonth = expiryDays % 31 === 0;
    const isYear = !isMonth && expiryDays % 365 === 0;

    return isYear ? 365 : isMonth ? 31 : 1;
  }

  public populateForm(index: number): void {
    const { projectLink: url, renewalPeriod: expiryDays } = this.trelloService.trelloProjects[index];

    const expiryType = this.getExpiryType(expiryDays);
    const expiryQuantity = expiryDays / expiryType;

    this.trelloForm.reset({ url, expiryQuantity, expiryType });
  }

  public clearForm(): void {
    this.trelloForm.reset(this.DEFAULT_FORM_VALUES);
  }

  public addTrelloProject(): void {
    this.clearForm();

    this.projectIndex = -1;
    this.trelloForm.controls['url'].enable();
  }

  public editTrelloProject(index: number): void {
    this.populateForm(index);

    this.projectIndex = index;
    this.trelloForm.controls['url'].disable();
  }

  public removeTrelloProject(index: number): void {
    this.projectIndex = index;
    this.trelloForm.controls['url'].disable();
  }

  public confirmRemoveTrelloProject(isConfirmed: boolean): void {
    if (isConfirmed) {
      this.trelloService.removeProject(this.projectIndex);
    }
  }

  public syncTrelloProject(index: number): void {
    this.trelloService.syncProject(index);
  }

  public exportCsvProject(index: number): void {
    this.projectIndex = index;
  }

  public exportLatexProject(index: number): void {
    this.projectIndex = index;
  }
}
