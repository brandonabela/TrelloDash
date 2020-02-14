import { AfterViewInit, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dropdown-checkbox',
  templateUrl: './dropdown-checkbox.component.html',
  styleUrls: ['./dropdown-checkbox.component.scss']
})
export class DropdownCheckboxComponent implements AfterViewInit {
  @Input()
  public dropdownForm: FormGroup;

  @Input()
  public dropdownArray: string;

  @Input()
  public checkboxArray: string[];

  ngAfterViewInit(): void {
    const dropdownCheckbox = Array.from(document.getElementsByClassName('dropdown-checkbox'));

    dropdownCheckbox.forEach(element => {
      element.addEventListener('click', ($event: Event) => {
        $event.stopPropagation();
      });
    });
  }
}
