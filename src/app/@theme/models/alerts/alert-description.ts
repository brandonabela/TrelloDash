import { AlertType } from './alert-type';

export class AlertDescription {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly type: AlertType
  ) { }
}
