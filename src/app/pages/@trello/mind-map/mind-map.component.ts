import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TrelloCard } from 'src/app/models/trello/trello-card';
import { TrelloService } from 'src/app/service/trello.service';

export class Branch {
  constructor(
    public readonly topic: string,
    public readonly children: Branch[] | TrelloCard[]
  ) {}
}

@Component({
  selector: 'app-page-mind-map',
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.scss']
})
export class MindMapComponent {
  public tree: Branch[] = [];

  public trelloForm!: UntypedFormGroup;
  public displayCard!: TrelloCard;

  constructor(
    public trelloService: TrelloService,
    private fb: UntypedFormBuilder
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
    this.trelloForm.valueChanges.subscribe(() => {
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

  public buildTree(): void {
    const { projectIndex, levelOne, levelTwo } = this.trelloForm.value;
    const trelloProject = this.trelloService.trelloProjects[projectIndex];

    this.tree = [];

    trelloProject.trelloCards.forEach((aTrelloCard, index) => {
      const levelValues = [
        this.cardLevelField(aTrelloCard, levelOne),
        this.cardLevelField(aTrelloCard, levelTwo),
      ];

      let currentChildren: (Branch | TrelloCard)[] = this.tree;

      for (let i = 0; i < levelValues.length; i++) {
        const level = levelValues[i];
        const nextBranch = currentChildren.find(
          (branch) => branch instanceof Branch && branch.topic === level
        );

        if (nextBranch && nextBranch instanceof Branch) {
          // If the branch with the level exists, set the 'currentChildren' to its children.
          currentChildren = nextBranch.children;
        } else if (level !== '') {
          // If the branch does not exist, create a new branch and set it as the child of the current branch.
          const branch = new Branch(level, []);
          currentChildren.push(branch);
          currentChildren = branch.children;
        }
      }

      currentChildren.push(aTrelloCard);

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
