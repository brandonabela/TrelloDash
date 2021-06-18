import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AlertDescription } from '../models/alerts/alert-description';
import { AlertTitle } from '../models/alerts/alert-title';
import { AlertType } from '../models/alerts/alert-type';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private toaster: ToastrService) { }

  public add(alert: AlertTitle | AlertDescription): void {
    const message = alert instanceof AlertDescription ? alert.paragraph : '';

    const options = {
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      positionClass: window.innerWidth < 1440 ? 'toast-bottom-full-width' : 'toast-bottom-right'
    };

    if (alert.type === AlertType.Success) {
      this.toaster.success(message, alert.title, options);
    } else if (alert.type === AlertType.Error) {
      this.toaster.error(message, alert.title, options);
    } else if (alert.type === AlertType.Warning) {
      this.toaster.warning(message, alert.title, options);
    } else if (alert.type === AlertType.Info) {
      this.toaster.info(message, alert.title, options);
    }
  }
}
