import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  user,
  signOut,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(EnvironmentInjector); // 1. Inject the EnvironmentInjector

  // This 'user$' is a Signal-friendly observable for your UI
  user$ = user(this.auth);

  login(email: string, pass: string) {
    // 2. Wrap the call in the injection context
    return runInInjectionContext(this.injector, () => {
      return signInWithEmailAndPassword(this.auth, email, pass);
    });
  }

  logout() {
    return runInInjectionContext(this.injector, () => {
      return signOut(this.auth);
    });
  }

  register(email: string, pass: string) {
    return runInInjectionContext(this.injector, () => {
      return createUserWithEmailAndPassword(this.auth, email, pass);
    });
  }
}