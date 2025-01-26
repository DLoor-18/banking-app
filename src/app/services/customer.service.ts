import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ICustomerResponse } from '../interfaces/customer-response.interface';
import { Observable } from 'rxjs';
import { ICustomerRequest } from '../interfaces/customer-request.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private base = environment.baseApi + "/customers";

  getAllCutomers(): Observable<ICustomerResponse[]>{
    return this.http.get<ICustomerResponse[]>(this.base);
  }

  createCustomer(request: ICustomerRequest): Observable<ICustomerResponse>{
    return this.http.post<ICustomerResponse>(this.base, request);
  }

}