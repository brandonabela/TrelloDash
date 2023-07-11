import { AlertType } from './alert-type';

export class AlertTitle {
  constructor(
    public readonly title: string,
    public readonly type: AlertType
  ) { }
}
