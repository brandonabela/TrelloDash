import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class Breadcrumb {
  constructor(public title: string, public url: string) { }
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: Breadcrumb[] = [];

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const root: ActivatedRoute = this.activatedRoute.root;

    this.breadcrumbs = [new Breadcrumb('Home', '/'), ...BreadcrumbComponent.getBreadcrumbs(root)];
  }

  private static getBreadcrumbs(route: ActivatedRoute, url = ''): Breadcrumb[] {
    const breadcrumbs: Breadcrumb[] = [];

    for (const child of route.children) {
      if (!Object.prototype.hasOwnProperty.call(child?.snapshot?.data, 'breadcrumb')) {
        return this.getBreadcrumbs(child, url) ?? breadcrumbs;
      }

      if (!BreadcrumbComponent.isRoot(child)) {
        url += BreadcrumbComponent.getUrl(child);

        breadcrumbs.push(new Breadcrumb(BreadcrumbComponent.getTitle(child), url));
      }
    }

    return breadcrumbs;
  }

  private static isRoot(child: ActivatedRoute): boolean {
    return !(child.snapshot.url?.length ?? 0);
  }

  private static getTitle(child: ActivatedRoute): string {
    return child.snapshot.data?.['breadcrumb'] ?? '';
  }

  private static getUrl(child: ActivatedRoute): string {
    const childUrls = child.snapshot.url.map(segment => segment.path);

    if (childUrls.length) {
      const lastUrlSegment = child.snapshot.url[child.snapshot.url.length - 1];

      if (lastUrlSegment.path.startsWith(':')) {
        const paramName = lastUrlSegment.path.split(':')[1];
        const paramValue = child.snapshot.params[paramName];
        const newPath = paramValue ? `/${paramValue}` : '';

        childUrls[childUrls.length - 1] = newPath;
      }
    }

    return `/${childUrls.join('/')}`;
  }
}
