import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { IDropdown } from '../../interfaces/icomponents/dropdown.interface';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  dropdownData = input<IDropdown>();
  onChange = output<string>();

  onChangeEvent(event: any) {
    const selectedValue = (event.target as HTMLSelectElement).value ?? '';
    this.onChange.emit(selectedValue);
  }

}