import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth: Auth = inject(Auth);

  return new Promise((res, rej) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        res(true);
      } else {
        res(router.parseUrl('/auth'));
      }
    })
  });
};
