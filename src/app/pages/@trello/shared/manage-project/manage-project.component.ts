import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';

@Component({
  selector: 'trello-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent implements OnInit {
  @Input()
  public trelloViewer: TrelloViewer;

  public trelloForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.trelloForm = this.fb.group({
      url: ['', Validators.required]
    });
  }

  public addTrelloURL(): void {
    const url = this.trelloForm.get('url').value;
    this.trelloViewer.addURL(url);

    this.trelloForm.reset();
  }

  public removeTrelloURL(index: number): void {
    this.trelloViewer.removeUrl(index);
  }
}
