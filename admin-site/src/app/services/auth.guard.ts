import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth: Auth = inject(Auth);

  if (auth.currentUser) {
    return true;
  } else {
    return router.parseUrl('/auth');
  }
};
