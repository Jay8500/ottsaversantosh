import { Component, inject, OnInit, runInInjectionContext, EnvironmentInjector } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Auth, authState } from '@angular/fire/auth';
import { take } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  ngOnInit() {
    this.setupApp();
  }

  async setupApp() {
    // 1. Status Bar
    try {
      await StatusBar.setStyle({ style: Style.Light });
    } catch (e) {
      console.log('Status bar not available');
    }

    // 2. Auth & Routing Logic
    runInInjectionContext(this.injector, () => {
      authState(this.auth)
        .pipe(take(1))
        .subscribe(async (user) => {
          let targetPath = '/login'; // Default

          if (user) {
            // Get the role we saved in storage during LoginPage
            const { value: role } = await Preferences.get({ key: 'user_role' });
            
            // Assign the correct path based on role
            targetPath = (role === 'admin') ? '/admin-dashboard' : '/tabs/tab1';
          }

          // 3. Navigate and Hide Splash
          await this.router.navigateByUrl(targetPath, { replaceUrl: true });
          
          try {
            await SplashScreen.hide();
          } catch (e) {
            console.log('Splash hidden');
          }
        });
    });
  }
}