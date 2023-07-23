import { Component } from '@angular/core';

import { AlertType } from 'src/app/@theme/models/alerts/alert-type';
import { AlertService } from 'src/app/@theme/service/alert.service';
import { AlertTitle } from 'src/app/@theme/models/alerts/alert-title';
import { AlertDescription } from 'src/app/@theme/models/alerts/alert-description';

@Component({
  selector: 'app-page-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  private title = 'I am the title of the alert';
  private description = 'I am the description of the alert where I explain something to the user';

  constructor(
    private alertService: AlertService
  ) { }

  public openAlertTitleSuccess() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Success));
  }

  public openAlertTitleError() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Error));
  }

  public openAlertTitleWarning() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Warning));
  }

  public openAlertTitlePrimary() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Primary));
  }

  public openAlertDescriptionSuccess() {
    this.alertService.add(new AlertDescription(this.title, this.description, AlertType.Success));
  }

  public openAlertDescriptionError() {
    this.alertService.add(new AlertDescription(this.title, this.description, AlertType.Error));
  }

  public openAlertDescriptionWarning() {
    this.alertService.add(new AlertDescription(this.title, this.description, AlertType.Warning));
  }

  public openAlertDescriptionPrimary() {
    this.alertService.add(new AlertDescription(this.title, this.description, AlertType.Primary));
  }
}
