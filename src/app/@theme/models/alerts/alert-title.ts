import { AlertType } from './alert-type';

export class AlertTitle {
  constructor(
    public title: string,
    public type: AlertType
  ) { }
}
