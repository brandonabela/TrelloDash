import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DropdownCheckboxFilter } from './components/DropdownCheckboxFilter';

@NgModule({
  declarations: [
    DropdownCheckboxFilter
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownCheckboxFilter
  ]
})
export class ThemeFiltersModule { }
