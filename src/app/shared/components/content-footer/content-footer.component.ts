import { Component } from '@angular/core';

@Component({
  selector: 'content-footer',
  templateUrl: './content-footer.component.html',
  styleUrls: ['./content-footer.component.scss']
})
export class ContentFooterComponent {
  public currentYear = new Date().getFullYear();
}
