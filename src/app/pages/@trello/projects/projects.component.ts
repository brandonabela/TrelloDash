import { Component, Input, OnInit } from '@angular/core';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { RequestService } from 'src/app/service/request.service';
import { StorageService } from 'src/app/service/storage.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'page-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  @Input()
  public trelloViewer: TrelloViewer;

  public trelloForm: FormGroup;

  public projectIndex: number;
  public projectNameSearch: string;

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
      url: ['', Validators.required],
      expiryQuantity: [1, Validators.required],
      expiryType: [1, Validators.required]
    });
  }

  public clearForm(): void {
    this.trelloForm.reset({
      url: '',
      expiryQuantity: 1,
      expiryType: 1
    });
  }

  public populateForm(index: number): void {
    const trelloProject = this.trelloViewer.getTrelloProject(index);

    const formUrl = trelloProject.projectLink;
    let formExpiryQuantity = trelloProject.validInDays;

    const formExpiryType = this.getExpiryType(formExpiryQuantity);

    formExpiryQuantity = formExpiryQuantity / formExpiryType;

    this.trelloForm.reset({
      url: formUrl,
      expiryQuantity: formExpiryQuantity,
      expiryType: formExpiryType
    });
  }

  public getExpiryType(expiryQuantity: number): number {
    const isYear = expiryQuantity % 365 === 0;
    const isMonth = expiryQuantity % 31 === 0;

    if (expiryQuantity === 0) {
      return 1;
    }

    return isYear ? 365 : (isMonth ? 31 : 1);
  }

  public addTrelloProject(): void {
    this.clearForm();
    this.projectIndex = -1;

    this.trelloForm.controls.url.enable();
  }

  public editTrelloProject(index: number): void {
    this.populateForm(index);
    this.projectIndex = index;

    this.trelloForm.controls.url.disable();
  }

  public removeTrelloProject(index: number): void {
    this.projectIndex = index;
  }

  public confirmRemoveTrelloProject($event: Event): void {
    if ($event) {
      this.trelloViewer.removeProject(this.projectIndex);
    }
  }
}
