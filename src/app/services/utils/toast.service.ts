import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IToast } from '../../interfaces/icomponents/toast.interface';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<IToast>();
  $dataToast: Observable<IToast> = this.toastSubject.asObservable();

  emitToast(dataToast: IToast): void {
    this.toastSubject.next(dataToast);
  }

}