import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

import { AlertDescription } from '../models/alerts/alert-description';
import { AlertTitle } from '../models/alerts/alert-title';
import { AlertType } from '../models/alerts/alert-type';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly TOAST_POSITION = {
    desktop: 'toast-bottom-right',
    mobile: 'toast-bottom-full-width'
  };

  private readonly TOAST_CONFIG: Partial<IndividualConfig> = {
    timeOut: 3000,
    closeButton: true,
    progressBar: true
  };

  constructor(private toastrService: ToastrService) { }

  public add(alert: AlertTitle | AlertDescription): void {
    const message = alert instanceof AlertDescription ? alert.description : '';

    const positionClass = window.innerWidth < 1440
      ? this.TOAST_POSITION.mobile
      : this.TOAST_POSITION.desktop;

    const options: Partial<IndividualConfig> = {
      ...this.TOAST_CONFIG,
      positionClass
    };

    switch (alert.type) {
      case AlertType.Success:
        this.toastrService.success(message, alert.title, options);
        break;
      case AlertType.Error:
        this.toastrService.error(message, alert.title, options);
        break;
      case AlertType.Warning:
        this.toastrService.warning(message, alert.title, options);
        break;
      case AlertType.Primary:
        this.toastrService.info(message, alert.title, options);
        break;
    }
  }
}
