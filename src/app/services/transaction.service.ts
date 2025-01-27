import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ITransactionResponse } from '../interfaces/transaction-response.interface';
import { ITransactionRequest } from '../interfaces/transaction-request.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private http = inject(HttpClient);
  private base = environment.baseApi + "/transactions";

  getAllTransactions(): Observable<ITransactionResponse[]>{
    return this.http.get<ITransactionResponse[]>(this.base);
  }

  findTransactionsByNumberAccount(numberAccount: string): Observable<ITransactionResponse[]>{
    return this.http.post<ITransactionResponse[]>(this.base + "/number-account", {property: numberAccount});
  }

  createTransaction(request: ITransactionRequest): Observable<ITransactionResponse>{
    return this.http.post<ITransactionResponse>(this.base, request);
  }
}
