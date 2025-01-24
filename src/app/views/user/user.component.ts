import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { ToastService } from '../../services/utils/toast.service';
import { LoaderService } from '../../services/utils/loader.service';
import { UserService } from '../../services/user.service';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { TableComponent } from '../../components/table/table.component';
import { CardComponent } from "../../components/card/card.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ToastComponent } from "../../components/toast/toast.component";
import { TableEventsService } from '../../services/utils/table-events.service';

@Component({
  selector: 'app-user',
  imports: [CardComponent, LoaderComponent, ToastComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  private destroy$ = new Subject<void>();
  private userService = inject(UserService);
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
      name: "Email",
      key: "email",
      type: "text"
    },
    {
      name: "Role",
      key: "userRole",
      type: "text"
    }
  ];

  cardData: ICard = {
    header: "Users",
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
    this.getAllUsers();
  }

  getAllUsers(){
    this.loaderService.show(true);
    this.userService.getAllUsers().subscribe(result => {
      if(result.length)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No Users found", "danger", 4000, true);

      this.loaderService.show(false);
    });
  }
}
