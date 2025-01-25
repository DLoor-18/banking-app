import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IUserResponse } from '../interfaces/user-response.interface';
import { IUserRequest } from '../interfaces/user-request.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private base: string = environment.baseApi + "/auth/users";

  getAllUsers(): Observable<IUserResponse[]>{
    return this.http.get<IUserResponse[]>(this.base);
  }

  createUser(request: IUserRequest): Observable<IUserResponse>{
    return this.http.post<IUserResponse>(this.base, request);
  }
}
