import { AlertType } from './alert-type';

export class AlertConfig {
  public static typeConfig = {
    [AlertType.Success]: {
      type: 'success',
      messageIcon: 'fas fa-check-circle'
    },
    [AlertType.Error]: {
      type: 'error',
      messageIcon: 'fas fa-times-circle'
    },
    [AlertType.Warning]: {
      type: 'warning',
      messageIcon: 'fas fa-exclamation-triangle'
    },
    [AlertType.Info]: {
      type: 'info',
      messageIcon: 'fas fa-info-circle'
    },
    [AlertType.Dark]: {
      type: 'dark',
      messageIcon: 'fas fa-info-circle'
    }
  };
}
