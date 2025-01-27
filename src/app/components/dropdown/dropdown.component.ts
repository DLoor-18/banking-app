import { Component, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { IDropdown } from '../../interfaces/icomponents/dropdown.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnChanges {
  dropdownData = input<IDropdown>();
  formGroup = input<FormGroup>();
  onChange = output<string>();
  formControl!: FormControl;

  onChangeEvent(event: any) {
    const selectedValue = (event.target as HTMLSelectElement).value ?? '';
    this.onChange.emit(selectedValue);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['controlName'] && this.formGroup()) {
      this.formControl = this.formGroup()!.get(this.dropdownData()?.formControlName!) as FormControl;
    }
  }
}