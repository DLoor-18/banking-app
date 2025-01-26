import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { ITransactionTypeResponse } from '../interfaces/transaction-type-response.interface';
import { ITransactionTypeRequest } from '../interfaces/transaction-type-request.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionTypeService {
  private http = inject(HttpClient);
  private base = environment.baseApi + "/transaction-types";

  getAllTransactionTypes(): Observable<ITransactionTypeResponse[]>{
    return this.http.get<ITransactionTypeResponse[]>(this.base);
  }

  createTransactionType(request: ITransactionTypeRequest): Observable<ITransactionTypeResponse>{
    return this.http.post<ITransactionTypeResponse>(this.base, request);
  }
}