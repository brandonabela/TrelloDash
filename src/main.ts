import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

"use strict";

document.addEventListener('DOMContentLoaded', (): void => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then(() => {})
    .catch((err: any) => console.error(err));
});
