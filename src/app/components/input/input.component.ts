import { Component, input, output } from '@angular/core';
import { IInput } from '../../interfaces/icomponents/input.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  inputData = input<IInput>();
  outputData = output<string>();

  input: string = '';

  inputEvent(event: Event) {
    return this.outputData.emit(this.input);
  }

}