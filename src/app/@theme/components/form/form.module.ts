import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { DropdownCheckboxComponent } from './dropdown-checkbox/dropdown-checkbox.component';
import { TextareaAutocompleteComponent } from './textarea-autocomplete/textarea-autocomplete.component';
import { ThemeFiltersModule } from '../../filters/theme-filters.module';

@NgModule({
  declarations: [
    DropdownCheckboxComponent,
    TextareaAutocompleteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ThemeFiltersModule
  ],
  exports: [
    DropdownCheckboxComponent,
    TextareaAutocompleteComponent
  ]
})
export class FormModule {
  static updateFieldStatus(formGroup: FormGroup | null, checkboxFormName: string, textFieldFormName: string): void {
    if (formGroup) {
      formGroup.get(checkboxFormName)?.valueChanges.subscribe(formValues => {
        if (formValues) {
          formGroup.get(textFieldFormName)?.enable();
        } else {
          formGroup.get(textFieldFormName)?.disable();
        }
      });
    }
  }
}
