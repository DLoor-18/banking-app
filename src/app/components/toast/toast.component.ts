import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { IToast } from '../../interfaces/icomponents/toast.interface';
import { interval, Subject, takeUntil, timer } from 'rxjs';
import { ToastService } from '../../services/utils/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnDestroy{
  toastData:IToast | undefined;
  toastService = inject(ToastService);

  private destroy$ = new Subject<void>();
  show: boolean = false;

  constructor() {
    this.toastService.$dataToast.pipe(takeUntil(this.destroy$)).subscribe(dataToast => {     
      this.toastData = dataToast;
      this.show = true;
      this.startTimer();
    });
  }

  startTimer(): void {
    timer(this.toastData?.duration as number)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.closeToast();
      });
  }

  closeToast(): void {
    this.show = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}