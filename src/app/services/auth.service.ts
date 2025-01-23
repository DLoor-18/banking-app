import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAuth } from '../interfaces/auth.interface';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IAuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  execute(request: IAuth): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(environment.baseApi + "/auth", request);
  }

}