import { CommonModule } from '@angular/common';
import { Component, inject, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IForm } from '../../interfaces/icomponents/form.interface';
import { ButtonComponent } from "../button/button.component";
import { ToastService } from '../../services/utils/toast.service';
import { FormService } from '../../services/utils/form.service';

@Component({
  selector: 'app-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnChanges {
  private fb = inject(FormBuilder);
  formService = inject(FormService);
  toastService = inject(ToastService);
  formData = input<IForm>();

  form!: FormGroup;
  loadFields: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.loadFields && this.formData()?.fields) {
      this.buildForm();
    }
  }

  buildForm(): void {
    const controls: any = {};
    this.formData()?.fields?.forEach((field) => {
        controls[field.name] = ['', field.validators || []];
    });
    this.form = this.fb.group(controls);
  }

  onSubmit(): void {
    if (this.form.valid){
      this.formService.sendForm(this.form.value);
    } else {
      this.toastService.emitToast("Error", "Inconsistency in fields", "error", 4000, true);
    }
  }

}