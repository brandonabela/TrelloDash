import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(router: Router) {
    const navEndEvents = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    );

    navEndEvents.subscribe((event: NavigationEnd) => {
      // Skip recording GA events to our account if in development.
      if (document.location.hostname !== 'localhost') {
        gtag('config', 'UA-149941240-1', {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
