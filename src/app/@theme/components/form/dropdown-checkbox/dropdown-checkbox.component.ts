import { AfterViewInit, Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'dropdown-checkbox',
  templateUrl: './dropdown-checkbox.component.html',
  styleUrls: ['./dropdown-checkbox.component.scss']
})
export class DropdownCheckboxComponent implements AfterViewInit {
  @Input() elementValues!: string[];
  @Input() elementFormGroup!: UntypedFormGroup;

  public elementFilter: string = '';

  ngAfterViewInit(): void {
    const dropdownCheckboxes = Array.from(document.getElementsByClassName('dropdown-checkbox'));

    const stopPropagation = (event: Event) => {
      event.stopPropagation();
    };

    for (const checkbox of dropdownCheckboxes) {
      checkbox.addEventListener('click', stopPropagation);
    }
  }

  public getTickedColumns(): string {
    const tickedColumns = this.elementValues.filter((_, index) => this.elementFormGroup.value[index]);

    return tickedColumns.length
      ? (tickedColumns.length === this.elementValues.length ? 'All Selected' : tickedColumns.join(', '))
      : 'Nothing Selected';
  }

  public trackByIndex(index: number, item: any): number {
    return index;
  }
}
