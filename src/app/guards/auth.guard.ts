import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const isAuthenticated = inject(TokenService).isAuthenticated();
  
  if (isAuthenticated)
    return true;

  inject(Router).navigateByUrl('login');
  return false;

};