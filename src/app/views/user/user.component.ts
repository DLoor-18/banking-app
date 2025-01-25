import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { concatMap, delay, of, Subject, takeUntil } from 'rxjs';
import { CardComponent } from "../../components/card/card.component";
import { FormComponent } from "../../components/form/form.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { TableComponent } from '../../components/table/table.component';
import { ToastComponent } from "../../components/toast/toast.component";
import { IButton } from '../../interfaces/icomponents/button.interface';
import { ICard } from '../../interfaces/icomponents/card.interface';
import { IField } from '../../interfaces/icomponents/field.interface';
import { IForm } from '../../interfaces/icomponents/form.interface';
import { IModal } from '../../interfaces/icomponents/modal.interface';
import { ITableHeader } from '../../interfaces/icomponents/table-header.interface';
import { UserService } from '../../services/user.service';
import { InputService } from '../../services/utils/input.service';
import { LoaderService } from '../../services/utils/loader.service';
import { TableEventsService } from '../../services/utils/table-events.service';
import { ToastService } from '../../services/utils/toast.service';
import { DialogComponent } from "../../components/dialog/dialog.component";
import { FormService } from '../../services/utils/form.service';
import { IUserRequest } from '../../interfaces/user-request.interface';
import { DialogService } from '../../services/utils/dialog.service';

@Component({
  selector: 'app-user',
  imports: [CardComponent, LoaderComponent, ToastComponent, ModalComponent, DialogComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy{
  private destroyTableEvent$ = new Subject<void>();
  private destroyForm$ = new Subject<void>();
  private tableEventsService = inject(TableEventsService);
  private formService = inject(FormService);
  private userService = inject(UserService);
  private inputService = inject(InputService);
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService);
  private loaderService = inject(LoaderService);
  
  private userRequest: IUserRequest | undefined;
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

  fieldData: IField[] = [
    {
      type: "input",
      name: "firstName",
      class: "col-6",
      input: this.inputService.generateInputData("firstName", "First Name", "", "John", "text", "firstName", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "lastName",
      class: "col-6",
      input: this.inputService.generateInputData("lastName", "Last Name", "", "Doe", "text", "lastName", true, false),
      validators: [Validators.required]
    },
    {
      type: "input",
      name: "email",
      class: "col-6",
      input: this.inputService.generateInputData("email", "Email", "", "john@gmail.com", "text", "email", true, false),
      validators: [Validators.required, Validators.email]
    },
    {
      type: "input",
      name: "password",
      class: "col-6",
      input: this.inputService.generateInputData("password", "Password", "", "Jhon123.", "text", "password", true, false),
      validators: [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$')]
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
    title: "Add User",
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
      this.userRequest = formData as IUserRequest;
      this.userRequest.userRole = this.userRequest.userRole ?? 'ROLE_EXECUTIVE';
      this.dialogConfirm();
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  ngOnDestroy(): void {
    this.destroyTableEvent$.next();
    this.destroyTableEvent$.complete();

    this.destroyForm$.next();
    this.destroyForm$.complete();
  }

  dialogConfirm() {
    this.presentDialog = true;
    this.dialogService.emitDialog("Confirm process", "Are you sure you want to continue with this process?", "Cancel", "Confirm");
  }

  getAllUsers(){
    this.loaderService.show(true);
    this.userService.getAllUsers().subscribe(result => {
      if(result.length)
        this.cardData.componentInputs['dataBody'] = result;
      else
        this.toastService.emitToast("Error", "No Users found", "error", 4000, true);

      this.loaderService.show(false);
    });
  }

  createUser() {
    if(!this.userRequest) 
      return;

    this.loaderService.show(true);
    this.userService.createUser(this.userRequest).pipe(delay(4000),
      concatMap(result => {
        if(result){
            this.toastService.emitToast("Success", "User created successfully", "success", 4000, true);
            this.presentDialog = false;
            this.showModal = false;
            return of (this.getAllUsers()); 
          }
        else{
          this.toastService.emitToast("Error", "User not created", "error", 4000, true);
          return of(null);
        }
      })
    ).subscribe(() => { 
      this.loaderService.show(false);
    });
  }
}
