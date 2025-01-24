import { Component, EventEmitter, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges {
  cardData = input<ICard>();
  componentOutput = output<any>();
  componentOutputs:  { [key: string]: (event: any) => void } = {};

  onComponentOutput(event: any){
    debugger
    this.componentOutput.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
   console.log(changes);
  }
}