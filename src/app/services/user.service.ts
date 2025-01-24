import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IUserResponse } from '../interfaces/user-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private base = environment.baseApi + "/auth/users";

  getAllUsers(): Observable<IUserResponse[]>{
    return this.http.get<IUserResponse[]>(this.base);
  }
}
