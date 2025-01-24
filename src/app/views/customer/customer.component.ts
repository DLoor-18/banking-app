import { Component, inject, OnInit } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { CardComponent } from "../../components/card/card.component";
import { TableEventsService } from '../../services/utils/table-events.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent } from "../../components/toast/toast.component";
import { ToastService } from '../../services/utils/toast.service';
import { CustomerService } from '../../services/customer.service';
import { LoaderService } from '../../services/utils/loader.service';
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-customer',
  imports: [CardComponent, ToastComponent, LoaderComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);

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

  cardData: ICard = {
    header: "Customers",
    component: TableComponent,
    componentInputs: {
      dataHeader: this.tableHeader,
      dataBody: []
    }
  };
  
  constructor(private eventBusService: TableEventsService){
    this.eventBusService.event$.pipe(takeUntil(this.destroy$)).subscribe(event => {
        console.log("Event Received", event);
        
    });
  }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  getAllCustomers(){
    this.loaderService.show(true);
    this.customerService.getAllCutomers().subscribe(result => {
      if(result.length)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No customers found", "danger", 4000, true);

      this.loaderService.show(false);
    });
  }

}