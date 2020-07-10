import { Component } from '@angular/core';
import { AlertDescription } from 'src/app/@theme/models/alerts/alert-description';
import { AlertTitle } from 'src/app/@theme/models/alerts/alert-title';
import { AlertType } from 'src/app/@theme/models/alerts/alert-type';
import { AlertService } from 'src/app/@theme/service/alert.service';

@Component({
  selector: 'page-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {
  private title = 'This is an alert box title';
  private description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque convallis at sapien.';

  constructor(private alertService: AlertService) { }

  public openAlertTitleSuccess() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Success));
  }

  public openAlertTitleError() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Error));
  }

  public openAlertTitleWarning() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Warning));
  }

  public openAlertTitleInfo() {
    this.alertService.add(new AlertTitle(this.title, AlertType.Info));
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

  public openAlertDescriptionInfo() {
    this.alertService.add(new AlertDescription(this.title, this.description, AlertType.Info));
  }
}
