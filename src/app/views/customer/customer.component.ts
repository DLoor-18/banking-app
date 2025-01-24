import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { CardComponent } from "../../components/card/card.component";
import { TableEventsService } from '../../services/utils/table-events.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent } from "../../components/toast/toast.component";
import { ToastService } from '../../services/utils/toast.service';

@Component({
  selector: 'app-customer',
  imports: [CardComponent, ToastComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private toastService = inject(ToastService);

  tableHeader: ITableHeader[] = [
    {
      name: "First Name",
      key: "firstName",
      type: "text"
    },
    {
      name: "Last Name",
      key: "lastName",
      type: "text"
    },
    {
      name: "Identity Card",
      key: "identityCard",
      type: "text"
    },
    {
      name: "Status",
      key: "status",
      type: "badge"
    }
  ];

  tableBody: any[] = [
    {
      firstName: "John",
      lastName: "Doe",
      identityCard: "123456789",
      status: "Active"
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      identityCard: "987654321",
      status: "Inactive"
    },
    {
      firstName: "John",
      lastName: "Doe",
      identityCard: "123456789",
      status: "Active"
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      identityCard: "987654321",
      status: "Inactive"
    },
    {
      firstName: "John",
      lastName: "Doe",
      identityCard: "123456789",
      status: "Active"
    }
  ];

  cardData: ICard = {
    header: "Customers",
    component: TableComponent,
    componentInputs: {
      dataHeader: this.tableHeader,
      dataBody: this.tableBody
    }
  };
  


  constructor(private eventBusService: TableEventsService){
    this.eventBusService.event$.pipe(takeUntil(this.destroy$)).subscribe(event => {

        console.log("Event Received", event);
        this.toastService.emitToast({
            title: "Event Received",
            message: "test toast...alert",
            type: "info",
            duration: 3000,
            close: true
        });
    });
}


  ngOnInit(): void {
  }

}