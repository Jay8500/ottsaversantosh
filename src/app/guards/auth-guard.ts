import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take, tap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
export const authGuard = async () => {
  // const auth = inject(Auth);
  const router = inject(Router);
  const { value } = await Preferences.get({ key: 'user_role' });
  if (value) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  };
};
