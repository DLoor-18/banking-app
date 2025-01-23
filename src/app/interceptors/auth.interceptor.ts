import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  if (tokenService.isAuthenticated()) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
