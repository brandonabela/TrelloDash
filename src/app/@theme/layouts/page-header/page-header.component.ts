import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {
  pageTitle = '';

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.pageTitle = this.activatedRoute.snapshot.data['breadcrumb'];
  }
}
