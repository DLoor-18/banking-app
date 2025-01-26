import { Component, inject, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { BadgeComponent } from "../badge/badge.component";
import { IBadge } from '../../interfaces/icomponents/badge.interface';
import { FormsModule } from '@angular/forms';
import { InputComponent } from "../input/input.component";
import { IInput } from '../../interfaces/icomponents/input.interface';
import { ButtonComponent } from "../button/button.component";
import { IButton } from '../../interfaces/icomponents/button.interface';
import { TableEventsService } from '../../services/utils/table-events.service';
import { BooleanTransformationPipe } from '../../pipes/boolean-transformation.pipe';
import { DataKeyTranformedPipe } from '../../pipes/data-key-tranformed.pipe';

@Component({
  selector: 'app-table',
  imports: [BadgeComponent, FormsModule, InputComponent, ButtonComponent, BooleanTransformationPipe, DataKeyTranformedPipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, OnChanges{
  dataHeader = input<ITableHeader[]>([]);
  dataBody = input<any[]>([]);
  dataBodyFiltered: any[] = [];

  private tableEventsService = inject(TableEventsService);

  inputData: IInput = {
    id: "search",
    label: "Search",
    value: "",
    placeholder: "Search...",
    type: "text",
    required: false,
    disabled: false
  };

  buttonData: IButton = {
    type: "info",
    value: "Add record",
    disabled: false
  };

  ngOnInit(): void {
    this.dataBodyFiltered = this.dataBody();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onSearch(this.inputData.value);
  }

  getBadge(value: string): IBadge {
    return {
      type: value === "ACTIVE" ? "info" : "error",
      value: value
    } as IBadge;
  }

  onButtonClick(event: any): void {
    this.tableEventsService.emitEvent("buttonClick", event);
  }

  onSearch(event: string): void {
    if (!event) {
      this.dataBodyFiltered = [...this.dataBody()];
      return;
    }

    const searchTerm = event.trim().toLowerCase();

    this.dataBodyFiltered = this.dataBody().filter(item => {
      return Object.values(item).some(value => {
        if (value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(searchTerm);
        }
        return false
      });
    });
  }

}
