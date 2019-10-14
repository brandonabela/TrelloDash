import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  public pageTitle: string;

  constructor(activatedRoute: ActivatedRoute) {
    this.pageTitle = activatedRoute.snapshot.data.breadcrumb;
  }
}
