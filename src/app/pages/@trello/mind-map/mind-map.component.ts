import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrelloCard } from 'src/app/models/trello/trello-card';
import { TrelloService } from 'src/app/service/trello.service';

export class Branch {
  constructor(
    public readonly topic: string,
    public readonly children: Branch[] | TrelloCard[]
  ) {}
}

@Component({
  selector: 'page-mind-map',
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.scss']
})
export class MindMapComponent {
  public tree: Branch[] = [];

  public trelloForm!: FormGroup;
  public displayCard!: TrelloCard;

  constructor(
    public trelloService: TrelloService,
    private fb: FormBuilder
  ) {
    const fields = this.trelloService.trelloProjects[0].trelloFieldNames;

    this.trelloForm = this.fb.group({
      projectIndex: [0, [Validators.required]],
      levelOne: [fields[1], [Validators.required]],
      levelTwo: [fields[4], [Validators.required]]
    });

    this.buildTree();
    this.onChanges();
  }

  onChanges(): void {
    this.trelloForm.valueChanges.subscribe((_: any) => {
      const { levelOne, levelTwo } = this.trelloForm.value;

      if (levelOne === levelTwo) {
        this.trelloForm.controls['levelTwo'].setValue('None');
      }

      this.buildTree()
    });
  }

  public fields(): string[] {
    const { projectIndex } = this.trelloForm.controls;
    const projectFields = this.trelloService.trelloProjects[projectIndex.value].trelloFieldNames;

    return ['None', projectFields[1], projectFields[4], ...projectFields.slice(6)];
  }

  public levelOneFields(): string[] {
    return this.fields().slice(1);
  }

  public levelTwoFields(): string[] {
    const { levelOne } = this.trelloForm.controls;

    const relevantFields = this.levelOneFields().filter(value => value !== levelOne.value);
    return ['None', ...relevantFields];
  }

  public cardLevelField(trelloCard: TrelloCard, levelValue: string): string {
    const levelIndex = this.fields().indexOf(levelValue);

    if (levelIndex == 0) {
      return '';
    }
    else if (levelIndex == 1) {
      return trelloCard.cardBoardName;
    }
    else if (levelIndex == 2) {
      return trelloCard.cardLabels.length ? trelloCard.cardLabels[0].name : 'Unassigned Label';
    }
    else {
      return trelloCard.cardCustomFields[levelIndex - 3].value;
    }
  }

  private targetBranch(levelValues: string[], index: number): any {
    let targetBranch: any = this.tree;

    if (index >= 0) {
      let pastLevels = levelValues.slice(0, index);

      pastLevels.forEach(level => {
        const branch = targetBranch.find((branch: any) => branch.topic === level);

        if (branch) {
          targetBranch = branch.children;
        }
      });
    }

    return targetBranch;
  }

  public buildTree(): void {
    const { projectIndex, levelOne, levelTwo } = this.trelloForm.value;
    const trelloProject = this.trelloService.trelloProjects[projectIndex];

    this.tree = [];

    trelloProject.trelloCards.forEach((aTrelloCard, index) => {
      const levelValues = [
        this.cardLevelField(aTrelloCard, levelOne),
        this.cardLevelField(aTrelloCard, levelTwo)
      ];

      levelValues.forEach((level, index) => {
        let targetBranch = this.targetBranch(levelValues, index);

        if (targetBranch instanceof Array && level !== '') {
          const levelPresent = targetBranch.find((branch: any) => branch.topic === level);

          if (!levelPresent) {
            const branch = new Branch(level, []);
            targetBranch.push(branch);
          }
        }
      });

      let targetBranch = this.targetBranch(levelValues, levelValues.length);
      targetBranch.push(aTrelloCard);

      if (index === 0) {
        this.setDisplayCard(aTrelloCard);
      }
    });
  }

  public isBranch(branch: Branch[] | TrelloCard[]): boolean {
    if (branch && branch.length > 0) {
      return 'topic' in branch[0];
    }

    return false;
  }

  public setDisplayCard(trelloCard: TrelloCard): void {
    this.displayCard = trelloCard;
  }

  public getCardLabelNames(trelloCard: TrelloCard): string {
    return trelloCard.cardLabels.map(label => label.name).join(', ') || 'Unassigned Label';
  }
}
