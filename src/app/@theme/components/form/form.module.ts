import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
export class FormModule { }
