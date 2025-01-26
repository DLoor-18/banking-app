import { Component, input } from '@angular/core';
import { IDropdown } from '../../interfaces/icomponents/dropdown.interface';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  dropdownData = input<IDropdown>();
}
