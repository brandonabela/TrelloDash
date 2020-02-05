import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TrelloViewer } from 'src/app/models/trello/trello-viewer';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { messages } from 'src/app/constants/messages';

@Component({
  selector: 'trello-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.scss']
})
export class ManageProjectComponent {
  @Input()
  public projectIndex: number;

  @Input()
  public trelloForm: FormGroup;

  @Input()
  public trelloViewer: TrelloViewer;

  constructor(
    private alertService: AlertService
  ) { }

  public isNewMode(): boolean {
    return this.projectIndex === -1;
  }

  public addTrelloProjectModal(): void {
    const url = this.trelloForm.get('url').value;

    const expiryQuantity = this.trelloForm.get('expiryQuantity').value;
    const expiryType = this.trelloForm.get('expiryType').value;
    const days = expiryQuantity * expiryType;

    if (0 <= days) {
      this.trelloViewer.addURL(url, days);
    } else {
      this.alertService.add(messages.trelloNegativeExpiry);
    }
  }

  public updateTrelloProjectModal(): void {
    const expiryQuantity = this.trelloForm.get('expiryQuantity').value;
    const expiryType = this.trelloForm.get('expiryType').value;
    const days = expiryQuantity * expiryType;

    if (0 <= days) {
      this.trelloViewer.updateProject(this.projectIndex, days);
    } else {
      this.alertService.add(messages.trelloNegativeExpiry);
    }
  }
}
