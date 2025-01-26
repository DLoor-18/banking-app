import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { DialogComponent } from "../../components/dialog/dialog.component";
import { Validators } from '@angular/forms';
import { Subject, takeUntil, delay, concatMap, of } from 'rxjs';
import { FormComponent } from '../../components/form/form.component';
import { TableComponent } from '../../components/table/table.component';
import { IAccountRequest } from '../../interfaces/account-request.interface';
import { IButton } from '../../interfaces/icomponents/button.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { IField } from '../../interfaces/icomponents/field.interface';
import { IForm } from '../../interfaces/icomponents/form.interface';
import { IModal } from '../../interfaces/icomponents/modal.interface';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { AccountService } from '../../services/account.service';
import { DialogService } from '../../services/utils/dialog.service';
import { DropdownService } from '../../services/utils/dropdown.service';
import { FormService } from '../../services/utils/form.service';
import { InputService } from '../../services/utils/input.service';
import { LoaderService } from '../../services/utils/loader.service';
import { TableEventsService } from '../../services/utils/table-events.service';
import { ToastService } from '../../services/utils/toast.service';
import { TransactionTypeService } from '../../services/transaction-type.service';
import { TransactionService } from '../../services/transaction.service';
import { ITransactionRequest } from '../../interfaces/transaction-request.interface';
import { IAccountResponse } from '../../interfaces/account-response.interface';
import { ITransactionTypeResponse } from '../../interfaces/transaction-type-response.interface';

@Component({
  selector: 'app-transaction',
  imports: [CardComponent, ModalComponent, DialogComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit, OnDestroy {
  private destroyTableEvent$ = new Subject<void>();
  private destroyForm$ = new Subject<void>();
  private tableEventsService = inject(TableEventsService);
  private formService = inject(FormService);
  private accountservice = inject(AccountService);
  private transactionTypeService = inject(TransactionTypeService);
  private transactionService = inject(TransactionService);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  private dialogService = inject(DialogService);

  private transactionRequest: ITransactionRequest | undefined;
  private accounts: IAccountResponse[] = [];
  private transactionTypes: ITransactionTypeResponse[] = [];

  showModal = false;
  presentDialog = true;
  
  tableHeader: ITableHeader[] = [
    {
      name: "Type",
      key: "transactionType.type",
      type: "text"
    },
    {
      name: "Account",
      key: "accountNumber",
      type: "text"
    },
    {
      name: "Amount",
      key: "amount",
      type: "text"
    },
    {
      name: "Cost",
      key: "transactionType.value",
      type: "text"
    },
    {
      name: "Balance",
      key: "account.balance",
      type: "text"
    },
    {
      name: "Processing Date",
      key: "processingDate",
      type: "text"
    },
    {
      name: "Owner IC",
      key: "account.user.identityCard",
      type: "text"
    }
  ];

  cardData: ICard = {
    header: "Transactions",
    component: TableComponent,
    componentInputs: {
      dataHeader: this.tableHeader,
      dataBody: []
    }
  };
  
  fieldData: IField[] = [
    {
      type: "input",
      name: "amount",
      class: "col-6",
      input: InputService.generateInputData("amount", "Amount", "", "0", "number", "amount", true, false),
      validators: [Validators.required, Validators.min(1)]
    },
    {
      type: "dropdown",
      name: "accountId",
      class: "col-12",
      dropdown: DropdownService.generateDropdownData("accountId", "Account", [], "accountId", true, false),
      validators: [Validators.required]
    },
    {
      type: "dropdown",
      name: "transactionTypeId",
      class: "col-12",
      dropdown: DropdownService.generateDropdownData("transactionTypeId", "Transaction Type", [], "transactionTypeId", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "details",
      class: "col-12",
      input: InputService.generateInputData("details", "Details", "", "Deposit of ..", "text", "details", true, false),
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
    title: "Add Transaction",
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
      let account = this.accounts.find(account => account.id === formData.accountId);
      let transactionType = this.transactionTypes.find(transactionType => transactionType.id === formData.transactionTypeId);

      if(transactionType?.discount && account && account.balance < (Number(formData.amount) + transactionType.value)){
        this.toastService.emitToast("Error", "Insufficient balance", "error", true);
        return;
      }
      this.transactionRequest = formData as ITransactionRequest;
      this.transactionRequest.status = this.transactionRequest.status ?? 'ACTIVE';
      this.dialogConfirm();
    });
  }

  ngOnInit(): void {
    this.getAllTransactions();
    this.getAllAccounts();
    this.getAllTransactionTypes();
  }

  ngOnDestroy(): void {
    this.destroyTableEvent$.next();
    this.destroyTableEvent$.complete();

    this.destroyForm$.next();
    this.destroyForm$.complete();
  }

  getAllAccounts() {
    this.loaderService.show(true);
    this.accountservice.getAllAccounts().subscribe(result => {
      if(result.length){
        this.accounts = result;
        let accountData: any[] = [];
        
        result.forEach(account => {
          account.status === 'ACTIVE' && accountData.push({
            label: account.accountNumber + ' - ' + account.user.firstName + ' ' + account.user.lastName + ' ($' + account.balance + ')',
            value: account.id});
        });

        this.fieldData = this.fieldData.map(field => 
          field.name === 'accountId' 
              ? {...field, dropdown: DropdownService.generateDropdownData("accountId", "Account", [...accountData], "accountId", true, false)}
              : field);
        this.modalData.componentInputs['formData'].fields = this.fieldData;
      }
      else
        this.toastService.emitToast("Error", "No accounts found", "error", true);

      this.loaderService.show(false);
    });
  }

  getAllTransactionTypes() {
    this.loaderService.show(true);
    this.transactionTypeService.getAllTransactionTypes().subscribe(result => {
      if(result.length){
        this.transactionTypes = result;
        let transactionTypeData: any[] = [];
        
        result.forEach(transactionType => {
          transactionType.status === 'ACTIVE' && transactionTypeData.push({
            label: transactionType.type + ' ($' + transactionType.value + ')',
            value: transactionType.id});
        });

        this.fieldData = this.fieldData.map(field => 
          field.name === 'transactionTypeId' 
              ? {...field, dropdown: DropdownService.generateDropdownData("transactionTypeId", "Transaction Type", [...transactionTypeData], "transactionTypeId", true, false)}
              : field);
        this.modalData.componentInputs['formData'].fields = this.fieldData;
      }
      else
        this.toastService.emitToast("Error", "No Transaction Types found", "error", true);

      this.loaderService.show(false);
    });
  }

  getAllTransactions() {
    this.loaderService.show(true);
    this.transactionService.getAllTransactions().subscribe(result => {
      if(result.length)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No transactions found", "error", true);

      this.loaderService.show(false);
    });
  }

  dialogConfirm() {
    this.presentDialog = true;
    this.dialogService.emitDialog("Confirm process", "Are you sure you want to continue with this process?", "Cancel", "Confirm");
  }

  createTransaction() {
    // if(!this.accountRequest) 
    //   return;

    // this.loaderService.show(true);
    // this.Accountservice.createAccount(this.accountRequest).pipe(delay(4000),
    //   concatMap(result => {
    //     if(result){
    //         this.toastService.emitToast("Success", "Account created successfully", "success", true);
    //         this.presentDialog = false;
    //         this.showModal = false;
    //         return of (this.getAllAccounts()); 
    //       }
    //     else{
    //       this.toastService.emitToast("Error", "Account not created", "error", true);
    //       return of(null);
    //     }
    //   })
    // ).subscribe(() => { 
    //   this.loaderService.show(false);
    // });
  }

}
