import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class Breadcrumb {
  constructor(public title: string, public url: string) { }
}

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const root: ActivatedRoute = this.activatedRoute.root;

    this.breadcrumbs.push(new Breadcrumb('Home', '/'));
    this.breadcrumbs.push(...this.getBreadcrumbs(root));
  }

  private getBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    for (const child of route.children) {
      if (!child.snapshot.data.hasOwnProperty('breadcrumb')) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      if (!this.isRoot(child)) {
        url += this.getUrl(child);

        breadcrumbs.push(new Breadcrumb(this.getTitle(child), url));
      }

      return this.getBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private isRoot(child: ActivatedRoute): boolean {
    return !Array.isArray(child.snapshot.url) || !child.snapshot.url.length;
  }

  private getTitle(child: ActivatedRoute): string {
    return child.snapshot.data.breadcrumb;
  }

  private getUrl(child: ActivatedRoute): string {
    const childUrls = child.snapshot.url;

    if (childUrls && childUrls.length) {
      const lastUrlSegment = childUrls.pop();

      if (lastUrlSegment.path.startsWith(':')) {
        const paramName = lastUrlSegment.path.split(':')[1];
        const paramValue = child.snapshot.params[paramName];

        lastUrlSegment.path.replace(lastUrlSegment.path, paramValue);
      }

      childUrls.push(lastUrlSegment);
    }

    return '/' + childUrls.join('/');
  }
}
