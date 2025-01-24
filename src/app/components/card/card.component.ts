import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { ICard } from '../../interfaces/icomponents/card.interface';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  cardData = input<ICard>();
  componentOutput = output<any>();
  componentOutputs:  { [key: string]: (event: any) => void } = {};

  onComponentOutput(event: any){
    this.componentOutput.emit(event);
  }

}