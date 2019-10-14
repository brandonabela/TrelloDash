import { AlertType } from './alert-type';

export class AlertDescription {
  constructor(
    public title: string,
    public paragraph: string,
    public type: AlertType
  ) { }
}
