declare var $: any;

import { Injectable } from '@angular/core';
import { AlertConfig } from '../models/alerts/alert-config';
import { AlertDescription } from '../models/alerts/alert-description';
import { AlertTitle } from '../models/alerts/alert-title';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public add(alert: AlertTitle | AlertDescription): void {
    const typeConfig = AlertConfig.typeConfig[alert.type];

    $.notify({
      title: '<strong>' + alert.title + '</strong>',
      icon: typeConfig.messageIcon,
      message: alert instanceof AlertTitle ? '' : alert.paragraph
    }, {
      type: typeConfig.type,
      template: this.getAlertComponent(),
      animate: {
        enter: 'animated fadeInRight',
        exit: 'animated fadeOutRight'
      },
      placement: {
        from: 'bottom',
        align: 'right'
      },
      offset: 20,
      spacing: 10,
      z_index: 1100,

      timer: 1000,
      mouse_over: 'pause',
      newest_on_top: false,
      showProgressbar: true
    });
  }

  public getAlertComponent(): string {
    return `
      <div data-notify="container" class="col-md-3 alert alert-{0}">
        <button type="button" class="close" data-notify="dismiss" aria-hidden="true"> &times; </button>

        <i data-notify="icon"></i>

        <div class="alert-content">
          <span data-notify="title">{1}</span>
          <span data-notify="message">{2}</span>
        </div>

        <div class="progress" data-notify="progressbar">
          <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
        </div>
      </div>
    `;
  }
}
