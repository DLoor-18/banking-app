import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private showSubject = new Subject<boolean>();
  show$: Observable<boolean> = this.showSubject.asObservable();

  emitChange(show: boolean): void {
    this.showSubject.next(show);
  }

}