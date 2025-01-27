import { inject } from '@angular/core';
import { TokenService } from '../services/utils/token.service';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '../services/utils/loader.service';
import { ToastService } from '../services/utils/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const loaderService = inject(LoaderService);
  const toastService = inject(ToastService);
  const router = inject(Router);
  let authReq = undefined;

  if (tokenService.isAuthenticated()) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenService.getToken()}`,
      },
    });
  }

  return next(authReq ?? req).pipe(
    catchError((error: HttpErrorResponse) => {
      loaderService.show(false);
      switch (error.status ) {
        case 400:
          toastService.emitToast("Error", error.error.message, "error", true);
          break;

        case 401:
          tokenService.revokeToken();
          router.navigate(['/login']);
          break;

        case 403:
          toastService.emitToast("Error", error.error.message, "error", true);
          break;

        case 500:
          toastService.emitToast("Error", "Please contact support.", "error", true);
          break;

      } 
      return throwError(() => error);
    })
  );
  
};
