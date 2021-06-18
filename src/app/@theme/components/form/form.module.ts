import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownCheckboxComponent } from './dropdown-checkbox/dropdown-checkbox.component';

@NgModule({
  declarations: [
    DropdownCheckboxComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    DropdownCheckboxComponent
  ]
})
export class FormModule {
  static updateFieldStatus(formGroup: FormGroup, checkboxFormName: string, textFieldFormName: string): void {
    formGroup.get(checkboxFormName).valueChanges.subscribe(formValues => {
      if (formValues) {
        formGroup.get(textFieldFormName).enable();
      } else {
        formGroup.get(textFieldFormName).disable();
      }
    });
  }
}
