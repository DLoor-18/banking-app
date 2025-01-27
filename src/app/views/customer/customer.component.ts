import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { concatMap, delay, of, Subject, takeUntil } from 'rxjs';
import { CardComponent } from "../../components/card/card.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { FormComponent } from '../../components/form/form.component';
import { ModalComponent } from "../../components/modal/modal.component";
import { TableComponent } from "../../components/table/table.component";
import { ICustomerRequest } from '../../interfaces/customer-request.interface';
import { IButton } from '../../interfaces/icomponents/button.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { IField } from '../../interfaces/icomponents/field.interface';
import { IForm } from '../../interfaces/icomponents/form.interface';
import { IModal } from '../../interfaces/icomponents/modal.interface';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { CustomerService } from '../../services/customer.service';
import { DialogService } from '../../services/utils/dialog.service';
import { FormService } from '../../services/utils/form.service';
import { InputService } from '../../services/utils/input.service';
import { LoaderService } from '../../services/utils/loader.service';
import { TableEventsService } from '../../services/utils/table-events.service';
import { ToastService } from '../../services/utils/toast.service';

@Component({
  selector: 'app-customer',
  imports: [CardComponent, DialogComponent, ModalComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit, OnDestroy {
  private destroyTableEvent$ = new Subject<void>();
  private destroyForm$ = new Subject<void>();
  private tableEventsService = inject(TableEventsService);
  private formService = inject(FormService);
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  private dialogService = inject(DialogService);

  private customerRequest: ICustomerRequest | undefined;
  showModal = false;
  presentDialog = true;
  
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
  
  fieldData: IField[] = [
    {
      type: "input",
      name: "firstName",
      class: "col-6",
      input: InputService.generateInputData("firstName", "First Name", "", "John", "text", "firstName", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "lastName",
      class: "col-6",
      input: InputService.generateInputData("lastName", "Last Name", "", "Doe", "text", "lastName", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "identityCard",
      class: "col-6",
      input: InputService.generateInputData("identityCard", "Identity Card", "", "0000000000", "number", "identityCard", true, false),
      validators: [Validators.required, Validators.pattern(/^\d{10}$/)]
    },
    {
      type: "input",
      name: "status",
      class: "col-6",
      input: InputService.generateInputData("status", "Status", "ACTIVE", "ACTIVE", "text", "status", true, true),
      validators: [Validators.required]
    }

  ];

  buttonData: IButton = {
    type: "info",
    value: "Add",
    disabled: false
  };

  formData: IForm = {
    fields: this.fieldData,
    buttonForm: this.buttonData
  };

  modalData: IModal = {
    title: "Add Customer",
    component: FormComponent,
    componentInputs: {
      formData: this.formData
    }
  };

    constructor(){
      this.tableEventsService.event$.pipe(takeUntil(this.destroyTableEvent$)).subscribe(event => {
          this.showModal = true;
      });
  
      this.formService.$formData.pipe(takeUntil(this.destroyForm$)).subscribe(formData => {
        this.customerRequest = formData as ICustomerRequest;
        this.customerRequest.status = this.customerRequest.status ?? 'ACTIVE';
        this.dialogConfirm();
      });
    }

  ngOnInit(): void {
    this.getAllCustomers();
  }

  ngOnDestroy(): void {
    this.destroyTableEvent$.next();
    this.destroyTableEvent$.complete();

    this.destroyForm$.next();
    this.destroyForm$.complete();
  }

  getAllCustomers(){
    this.loaderService.show(true);
    this.customerService.getAllCutomers().subscribe(result => {
      if(result.length && this.cardData.componentInputs)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No customers found", "error", true);

      this.loaderService.show(false);
    });
  }

  dialogConfirm() {
    this.presentDialog = true;
    this.dialogService.emitDialog("Confirm process", "Are you sure you want to continue with this process?", "Cancel", "Confirm");
  }

  createCustomer() {
    if(!this.customerRequest) 
      return;

    this.loaderService.show(true);
    this.customerService.createCustomer(this.customerRequest).pipe(delay(4000),
      concatMap(result => {
        if(result){
            this.toastService.emitToast("Success", "Customer created successfully", "success", true);
            this.presentDialog = false;
            this.showModal = false;
            return of (this.getAllCustomers()); 
          }
        else{
          this.toastService.emitToast("Error", "Customer not created", "error", true);
          return of(null);
        }
      })
    ).subscribe(() => { 
      this.loaderService.show(false);
    });
  }

}