import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { concatMap, delay, of, Subject, takeUntil } from 'rxjs';
import { CardComponent } from "../../components/card/card.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { FormComponent } from '../../components/form/form.component';
import { ModalComponent } from "../../components/modal/modal.component";
import { TableComponent } from '../../components/table/table.component';
import { IAccountRequest } from '../../interfaces/account-request.interface';
import { IButton } from '../../interfaces/icomponents/button.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { IField } from '../../interfaces/icomponents/field.interface';
import { IForm } from '../../interfaces/icomponents/form.interface';
import { IModal } from '../../interfaces/icomponents/modal.interface';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';
import { DialogService } from '../../services/utils/dialog.service';
import { DropdownService } from '../../services/utils/dropdown.service';
import { FormService } from '../../services/utils/form.service';
import { InputService } from '../../services/utils/input.service';
import { LoaderService } from '../../services/utils/loader.service';
import { TableEventsService } from '../../services/utils/table-events.service';
import { ToastService } from '../../services/utils/toast.service';

@Component({
  selector: 'app-account',
  imports: [CardComponent, ModalComponent, DialogComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit, OnDestroy {
  private destroyTableEvent$ = new Subject<void>();
  private destroyForm$ = new Subject<void>();
  private tableEventsService = inject(TableEventsService);
  private formService = inject(FormService);
  private accountservice = inject(AccountService);
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  private dialogService = inject(DialogService);

  private accountRequest: IAccountRequest | undefined;
  showModal = false;
  presentDialog = true;
  
  tableHeader: ITableHeader[] = [
    {
      name: "Account Number",
      key: "accountNumber",
      type: "text"
    },
    {
      name: "Balance",
      key: "balance",
      type: "text"
    },
    {
      name: "First Name",
      key: "user.firstName",
      type: "text"
    },
    {
      name: "Last Name",
      key: "user.lastName",
      type: "text"
    },
    {
      name: "Status",
      key: "status",
      type: "badge"
    }
  ];

  cardData: ICard = {
    header: "Accounts",
    component: TableComponent,
    componentInputs: {
      dataHeader: this.tableHeader,
      dataBody: []
    }
  };
  
  fieldData: IField[] = [
    {
      type: "input",
      name: "accountNumber",
      class: "col-6",
      input: InputService.generateInputData("accountNumber", "Account Number", "", "0000000000", "text", "accountNumber", true, false),
      validators: [Validators.required, Validators.pattern(/^\d{10}$/)]
    },
    {
      type: "input",
      name: "balance",
      class: "col-6",
      input: InputService.generateInputData("balance", "Balance", "", "0", "text", "balance", true, false),
      validators: [Validators.required, Validators.min(0)]
    },
    {
      type: "dropdown",
      name: "customerId",
      class: "col-6",
      dropdown: DropdownService.generateDropdownData("customerId", "Customer", [], "customerId", true, false),
      validators: [Validators.required]
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
    title: "Add Account",
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
      this.accountRequest = formData as IAccountRequest;
      this.accountRequest.status = this.accountRequest.status ?? 'ACTIVE';
      this.dialogConfirm();
    });
  }

  ngOnInit(): void {
    this.getAllAccounts();
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
      if(result.length){
        let customerData: any[] = [];
        
        result.forEach(customer => {
          customerData.push({
            label: customer.firstName + ' ' + customer.lastName,
            value: customer.id});
        });

        this.fieldData = this.fieldData.map(field => 
          field.name === 'customerId' 
              ? {...field, dropdown: DropdownService.generateDropdownData("customerId", "Customer", [...customerData], "customerId", true, false)}
              : field);
        this.modalData.componentInputs['formData'].fields = this.fieldData;
      }
      else
        this.toastService.emitToast("Error", "No customers found", "error", true);

      this.loaderService.show(false);
    });
  }

  getAllAccounts(){
    this.loaderService.show(true);
    this.accountservice.getAllAccounts().subscribe(result => {
      if(result.length && this.cardData.componentInputs)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No accounts found", "error", true);

      this.loaderService.show(false);
    });
  }

  dialogConfirm() {
    this.presentDialog = true;
    this.dialogService.emitDialog("Confirm process", "Are you sure you want to continue with this process?", "Cancel", "Confirm");
  }

  createAccount() {
    if(!this.accountRequest) 
      return;

    this.loaderService.show(true);
    this.accountservice.createAccount(this.accountRequest).pipe(delay(4000),
      concatMap(result => {
        if(result){
            this.toastService.emitToast("Success", "Account created successfully", "success", true);
            this.presentDialog = false;
            this.showModal = false;
            return of (this.getAllAccounts()); 
          }
        else{
          this.toastService.emitToast("Error", "Account not created", "error", true);
          return of(null);
        }
      })
    ).subscribe(() => { 
      this.loaderService.show(false);
    });
  }

}