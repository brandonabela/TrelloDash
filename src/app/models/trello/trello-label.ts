export class TrelloLabel {
  constructor(public labelName: string, public labelColour: string) {
    this.labelColour = TrelloLabel.getRGBFromColour(labelColour);
  }

  private static getRGBFromColour(colour: string): string {
    switch (colour) {
      case 'black':
        return '#355263';
      case 'blue':
        return '#0079bf';
      case 'green':
        return '#61bd4f';
      case 'lime':
        return '#51e898';
      case 'orange':
        return '#ff9f1a';
      case 'pink':
        return '#ff78cb';
      case 'purple':
        return '#c377e0';
      case 'red':
        return '#eb5a46';
      case 'sky':
        return '#00c2e0';
      case 'yellow':
        return '#f2d600';
      default:
        return '#b3bec4';
    }
  }
}
