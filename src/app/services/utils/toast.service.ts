import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IToast } from '../../interfaces/icomponents/toast.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<IToast>();
  $toastData: Observable<IToast> = this.toastSubject.asObservable();

  emitToast(title: string, message: string, type: string, close: boolean | true, duration?: number): void {
    let toastData = {
      title: title,
      message: message,
      type: type,
      close: close,
      duration: duration ?? environment.timeToast
    }

    this.toastSubject.next(toastData as IToast);
  }

}