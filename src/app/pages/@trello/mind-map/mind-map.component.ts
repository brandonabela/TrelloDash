declare var jsMind: any;

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { TrelloCard } from 'src/app/models/trello/trello-card';
import { TrelloProject } from 'src/app/models/trello/trello-project';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { RequestService } from 'src/app/service/request.service';
import { StorageService } from 'src/app/service/storage.service';

@Component({
  selector: 'page-mind-map',
  templateUrl: './mind-map.component.html',
  styleUrls: ['./mind-map.component.scss']
})
export class MindMapComponent implements OnInit {
  @Input()
  public trelloViewer: TrelloViewer;

  public trelloForm: FormGroup;

  public mindMap: any;

  public mouseClick = false;
  public mouseDownX: number;
  public mouseDownY: number;

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private requestService: RequestService,
    private fb: FormBuilder
  ) {
    this.trelloViewer = new TrelloViewer(this.alertService, this.storageService, this.requestService);
  }

  ngOnInit() {
    this.trelloForm = this.fb.group({
      projectIndex: [0, Validators.required],
      firstParentIndex: [0, Validators.required],
      secondParentIndex: [1, Validators.required]
    });

    this.populateMindMap();
    this.onChanges();
  }

  onChanges(): void {
    this.trelloForm.valueChanges.subscribe(_ => {
      this.populateMindMap();
    });
  }

  public getFirstParentFields(): string[] {
    const projectIndex = this.trelloForm.get('projectIndex').value;

    const projectFields = this.trelloViewer.getTrelloProject(projectIndex).trelloFieldNames;
    const relevantFields = [projectFields[1], projectFields[4]].concat(projectFields.slice(6));

    return relevantFields;
  }

  public getSecondParentFields(): string[] {
    const firstParentIndex = this.trelloForm.get('firstParentIndex').value;

    let relevantFields = this.getFirstParentFields();
    relevantFields.splice(firstParentIndex, 1);
    relevantFields = ['None'].concat(relevantFields);

    return relevantFields;
  }

  public getProjectFields(): string[] {
    const trelloProjects = this.trelloViewer.getTrelloProjects();
    const projectFields = [].concat(...trelloProjects.map(aProject => aProject.trelloFieldNames));

    const uniqueFields = [...new Set(projectFields)];
    const relevantFields = [uniqueFields[1], uniqueFields[4]].concat(uniqueFields.slice(6));

    return relevantFields;
  }

  public createMindMap(): any {
    const options = {
      container: 'jsmind_container',
      editable: false,
      theme: 'primary'
    };

    let jsInner: Element;
    let enableCall = true;

    const jsContainer = document.getElementById('jsmind_container');

    jsContainer.addEventListener('wheel', event => {
      if (event.deltaY < 0) {
        this.mindMap.view.zoomIn();
      } else if (event.deltaY > 0) {
        this.mindMap.view.zoomOut();
      }

      event.preventDefault();
      event.stopPropagation();
    });

    jsContainer.addEventListener('mousedown', event => {
      this.mouseClick = true;
      this.mouseDownX = event.pageX;
      this.mouseDownY = event.pageY;

      if (jsInner === undefined) {
        jsInner = document.getElementsByClassName('jsmind-inner')[0];
      }
    });

    jsContainer.addEventListener('mousemove', event => {
      if (enableCall && this.mouseClick) {
        jsInner.scrollTop += (this.mouseDownY - event.pageY);
        jsInner.scrollLeft += (this.mouseDownX - event.pageX);

        enableCall = false;
        setTimeout(() => enableCall = true, 100);
      }
    });

    jsContainer.addEventListener('mouseup', () => {
      this.mouseClick = false;
    });

    return new jsMind(options);
  }

  public populateMindMap(): void {
    if (this.mindMap === undefined) {
      this.mindMap = this.createMindMap();
    }

    const mindMapObject = this.getMindMapObject();

    this.mindMap.show(mindMapObject);
  }

  public getCardField(card: TrelloCard, parentIndex: number): any {
    if (parentIndex === 0) {
      return card.cardBoardName;
    } else if (parentIndex === 1) {
      return [].concat(...card.cardLabels.map(aLabel => aLabel.labelName));
    } else {
      return card.cardCustomFields[parentIndex - 2].fieldValue;
    }
  }

  public isBranchPresent(mindMapData: any[], current: string, previous = ''): boolean {
    let branchPresent = false;

    mindMapData.filter(branch => {
      const branchNames = branch.id.split('/');

      const currentBranch = branchNames.length >= 1 ? branchNames[branchNames.length - 1] : '';
      const previousBranch = branchNames.length >= 2 ? branchNames[branchNames.length - 2] : '';

      if (currentBranch === current && (previous === '' || previousBranch === previous)) {
        branchPresent = true;
      }
    });

    return branchPresent;
  }

  public getMindMapData(project: TrelloProject, firstParentIndex: number, secondParentIndex: number): any {
    const mindMapData = [];
    mindMapData.push({ id: 'root', isroot: true, topic: project.projectName });

    let branchCounter = 0;

    project.trelloCards.forEach(card => {
      const firstFields = [].concat(this.getCardField(card, firstParentIndex));

      firstFields.forEach(firstField => {
        if (!this.isBranchPresent(mindMapData, firstField)) {
          mindMapData.push({
            id: firstField,
            parentid: 'root',
            topic: firstField,
            direction: (branchCounter % 2 === 0) ? 'left' : 'right'
          });

          branchCounter++;
        }

        if (secondParentIndex !== -1) {
          const secondFields = [].concat(this.getCardField(card, secondParentIndex));

          secondFields.forEach(secondField => {
            if (!this.isBranchPresent(mindMapData, secondField, firstField)) {
              mindMapData.push({
                id: firstField + '/' + secondField,
                parentid: firstField,
                topic: secondField
              });
            }

            mindMapData.push({
              id: firstField + '/' + secondField + '/' + card.cardName,
              parentid: firstField + '/' + secondField,
              topic: card.cardName,
            });
          });
        } else {
          mindMapData.push({
            id: firstField + '/' + card.cardName,
            parentid: firstField,
            topic: card.cardName,
          });
        }
      });
    });

    return mindMapData;
  }

  public getMindMapObject(): any {
    const projectIndex = Number(this.trelloForm.get('projectIndex').value);
    const firstParentIndex = Number(this.trelloForm.get('firstParentIndex').value);
    let secondParentIndex = Number(this.trelloForm.get('secondParentIndex').value);

    if (firstParentIndex >= secondParentIndex) {
      secondParentIndex--;
    }

    const project = this.trelloViewer.getTrelloProject(projectIndex);

    const mindMapData = this.getMindMapData(project, firstParentIndex, secondParentIndex);

    const mindMap = {
      meta: { name: project.projectName },
      format: 'node_array',
      data: mindMapData
    };

    return mindMap;
  }

  public fullscreen(): void {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      const element = document.getElementById('jsmind_container');

      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  }
}
