import {
  Component,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore'; // 1. Add these
import {
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  ToastController,
  LoadingController, // This is a Service
  AlertController, // This is a Service
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth';
import { Preferences } from '@capacitor/preferences';
import { Auth, user } from '@angular/fire/auth';
import { take } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    // IonHeader, // Must be here for <ion-header>
    // IonToolbar, // Must be here for <ion-toolbar>
    // IonTitle, // Must be here for <ion-title>
    // NOTE: LoadingController and AlertController are NOT added here
  ],
})
export class LoginPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);
  private firestore = inject(Firestore); // 2. Inject Firestore
  private toastCtrl = inject(ToastController);
  private injector = inject(EnvironmentInjector); // <--- Add this
  private auth = inject(Auth);
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off-outline';
  credentials = { email: '', password: '' };

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit() {
    // We wrap this in runInInjectionContext to keep Firebase happy during the refresh boot-up
    runInInjectionContext(this.injector, () => {
      user(this.auth)
        .pipe(take(1))
        .subscribe(async (currentUser) => {
          if (currentUser) {
            // 1. Check the storage for the role you saved in LoginPage
            const { value } = await Preferences.get({ key: 'user_role' });

            // 2. Route based on the stored role
            if (value === 'admin') {
              this.router.navigateByUrl('/admin-dashboard', {
                replaceUrl: true,
              });
            } else {
              this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
            }
          } else {
            // 3. Not logged in? Go to login page
            this.router.navigateByUrl('/login', { replaceUrl: true });
          }
        });
    });
  }

  togglePassword() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon =
      this.passwordIcon === 'eye-off-outline'
        ? 'eye-outline'
        : 'eye-off-outline';
  }

  async onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.presentToast('Please enter both email and password', 'warning');
      return;
    }
    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    try {
      const result = await this.authService.login(
        this.credentials.email,
        this.credentials.password
      );
      const uid = result.user.uid;

      // Wrap the Firestore part to maintain the Injection Context
      await runInInjectionContext(this.injector, async () => {
        const userDocRef = doc(this.firestore, `users/${uid}`);
        const userSnap = await getDoc(userDocRef);

        await loading.dismiss();
        this.presentToast('Welcome back!', 'success');

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const role = userData['role'];

          await Preferences.set({ key: 'user_role', value: role });

          if (role === 'admin') {
            this.router.navigateByUrl('/admin-dashboard', { replaceUrl: true });
          } else {
            this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
          }
        } else {
          this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
        }
      });
    } catch (e: any) {
      // ... existing error handling ...
    }
  }

  async onSignup() {
    try {
      await this.authService.register(
        this.credentials.email,
        this.credentials.password
      );
      // After signup, Firebase logs them in automatically
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (e: any) {
      alert('Signup Failed: ' + e.message);
    }
  }

  goToSignIn() {
    this.router.navigateByUrl('/signup', { replaceUrl: true });
  }

  async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'danger'
  ) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      color: color,
      // buttons: [{ text: 'Done', role: 'cancel' }],
    });
    await toast.present();
  }
}
