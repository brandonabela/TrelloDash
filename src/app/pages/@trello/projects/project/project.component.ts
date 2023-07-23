import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { messages } from 'src/app/constants/messages';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { TrelloService } from 'src/app/service/trello.service';

@Component({
  selector: 'app-trello-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent {
  @Input() public projectIndex!: number;
  @Input() public trelloForm!: UntypedFormGroup;

  constructor(
    private alertService: AlertService,
    private trelloService: TrelloService
  ) { }

  public isNewMode(): boolean {
    return this.projectIndex === -1;
  }

  public addTrelloProjectModal(): void {
    const url = this.trelloForm.controls['url'].value;

    const expiryQuantity = this.trelloForm.controls['expiryQuantity'].value;
    const expiryType = this.trelloForm.controls['expiryType'].value;
    const days = expiryQuantity * expiryType;

    if (0 <= days) {
      this.trelloService.addProject(url, days);
    } else {
      this.alertService.add(messages.trelloNegativeExpiry);
    }
  }

  public updateTrelloProjectModal(): void {
    const expiryQuantity = this.trelloForm.get('expiryQuantity')?.value;
    const expiryType = this.trelloForm.get('expiryType')?.value;
    const days = expiryQuantity * expiryType;

    if (0 <= days) {
      this.trelloService.updateRenewalPeriod(this.projectIndex, days);
    }
    else {
      this.alertService.add(messages.trelloNegativeExpiry);
    }
  }
}
