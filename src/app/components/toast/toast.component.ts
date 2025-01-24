import { Component, inject, input, OnInit } from '@angular/core';
import { IToast } from '../../interfaces/icomponents/toast.interface';
import { interval, Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../services/utils/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  toastData:IToast | undefined;
  toastService = inject(ToastService);

  private destroy$ = new Subject<void>();
  show: boolean = true;

  constructor() {
    this.toastService.$dataToast.pipe(takeUntil(this.destroy$)).subscribe(dataToast => {
      this.toastData = dataToast;
      this.show = true;
    });
  }

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer(): void {
    interval(this.toastData?.duration)
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