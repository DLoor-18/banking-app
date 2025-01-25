import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IToast } from '../../interfaces/icomponents/toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<IToast>();
  $toastData: Observable<IToast> = this.toastSubject.asObservable();

  emitToast(title: string, message: string, type: string, duration: number | 3000, close: boolean | true): void {
    let toastData = {
      title: title,
      message: message,
      type: type,
      duration: duration,
      close: close
    }

    this.toastSubject.next(toastData as IToast);
  }

}