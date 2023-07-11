import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dropdownCheckboxFilter',
  pure: true
})
export class DropdownCheckboxFilter implements PipeTransform {
  transform(items: string[], search: string): string[] {
    const searchLower = search.toLowerCase();

    return items.filter(value => value.toLowerCase().includes(searchLower));
  }
}
