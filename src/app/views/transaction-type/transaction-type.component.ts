import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ToastComponent } from "../../components/toast/toast.component";
import { concatMap, delay, of, Subject, takeUntil } from 'rxjs';
import { TableEventsService } from '../../services/utils/table-events.service';
import { FormService } from '../../services/utils/form.service';
import { ToastService } from '../../services/utils/toast.service';
import { LoaderService } from '../../services/utils/loader.service';
import { DialogService } from '../../services/utils/dialog.service';
import { InputService } from '../../services/utils/input.service';
import { TransactionTypeService } from '../../services/transaction-type.service';
import { ITransactionTypeRequest } from '../../interfaces/transaction-type-request.interface';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { TableComponent } from '../../components/table/table.component';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { IField } from '../../interfaces/icomponents/field.interface';
import { Validators } from '@angular/forms';
import { IButton } from '../../interfaces/icomponents/button.interface';
import { IForm } from '../../interfaces/icomponents/form.interface';
import { IModal } from '../../interfaces/icomponents/modal.interface';
import { FormComponent } from '../../components/form/form.component';
import { DropdownService } from '../../services/utils/dropdown.service';

@Component({
  selector: 'app-transaction-type',
  imports: [CardComponent, ModalComponent, DialogComponent, LoaderComponent, ToastComponent],
  templateUrl: './transaction-type.component.html',
  styleUrl: './transaction-type.component.scss'
})
export class TransactionTypeComponent  implements OnInit, OnDestroy {
  private destroyTableEvent$ = new Subject<void>();
  private destroyForm$ = new Subject<void>();
  private tableEventsService = inject(TableEventsService);
  private formService = inject(FormService);
  private transactionTypeService = inject(TransactionTypeService);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  private dialogService = inject(DialogService);

  private transactionTypeRequest: ITransactionTypeRequest | undefined;
  showModal = false;
  presentDialog = true;
  
  tableHeader: ITableHeader[] = [
    {
      name: "Type",
      key: "type",
      type: "text"
    },
    {
      name: "Value",
      key: "value",
      type: "text"
    },
    {
      name: "Transaction Cost",
      key: "transactionCost",
      type: "boolean"
    },
    {
      name: "Discount",
      key: "discount",
      type: "boolean"
    },
    {
      name: "Status",
      key: "status",
      type: "badge"
    }
  ];

  cardData: ICard = {
    header: "Transaction Types",
    component: TableComponent,
    componentInputs: {
      dataHeader: this.tableHeader,
      dataBody: []
    }
  };
  
  fieldData: IField[] = [
    {
      type: "input",
      name: "type",
      class: "col-12",
      input: InputService.generateInputData("type", "Type", "", "Deposit", "text", "type", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "description",
      class: "col-12",
      input: InputService.generateInputData("description", "Description", "", "Deposit of ..", "text", "description", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "value",
      class: "col-6",
      input: InputService.generateInputData("value", "Value", "", "0", "number", "value", true, false),
      validators: [Validators.required, Validators.min(0)]
    },
    {
      type: "dropdown",
      name: "transactionCost",
      class: "col-6",
      dropdown: DropdownService.generateDropdownData("transactionCost", "Transaction Cost", [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ], "transactionCost", true, false),
      validators: [Validators.required]
    },
    {
      type: "dropdown",
      name: "discount",
      class: "col-6",
      dropdown: DropdownService.generateDropdownData("discount", "Discount", [
        { label: "Yes", value: true },
        { label: "No", value: false }
      ], "discount", true, false),
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
    title: "Add Transaction Type",
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
      this.transactionTypeRequest = formData as ITransactionTypeRequest;
      this.transactionTypeRequest.status = this.transactionTypeRequest.status ?? 'ACTIVE';
      this.dialogConfirm();
    });
  }

  ngOnInit(): void {
    this.getAllTransactionTypes();
  }

  ngOnDestroy(): void {
    this.destroyTableEvent$.next();
    this.destroyTableEvent$.complete();

    this.destroyForm$.next();
    this.destroyForm$.complete();
  }

  getAllTransactionTypes(){
    this.loaderService.show(true);
    this.transactionTypeService.getAllTransactionTypes().subscribe(result => {
      if(result.length)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No Transaction Types found", "error", true);

      this.loaderService.show(false);
    });
  }

  dialogConfirm() {
    this.presentDialog = true;
    this.dialogService.emitDialog("Confirm process", "Are you sure you want to continue with this process?", "Cancel", "Confirm");
  }

  createTransactionType() {
    if(!this.transactionTypeRequest) 
      return;

    this.loaderService.show(true);
    this.transactionTypeService.createTransactionType(this.transactionTypeRequest).pipe(delay(4000),
      concatMap(result => {
        if(result){
            this.toastService.emitToast("Success", "Transaction Type created successfully", "success", true);
            this.presentDialog = false;
            this.showModal = false;
            return of (this.getAllTransactionTypes()); 
          }
        else{
          this.toastService.emitToast("Error", "Transaction Type not created", "error", true);
          return of(null);
        }
      })
    ).subscribe(() => { 
      this.loaderService.show(false);
    });
  }
}