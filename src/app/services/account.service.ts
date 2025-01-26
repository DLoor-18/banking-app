import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IAccountResponse } from '../interfaces/account-response.interface';
import { IAccountRequest } from '../interfaces/account-request.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private base = environment.baseApi + "/accounts";

  getAllAccounts(): Observable<IAccountResponse[]>{
    return this.http.get<IAccountResponse[]>(this.base);
  }

  createAccount(request: IAccountRequest): Observable<IAccountResponse>{
    return this.http.post<IAccountResponse>(this.base, request);
  }
}