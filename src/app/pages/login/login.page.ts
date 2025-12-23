import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  LoadingController, // This is a Service
  AlertController, // This is a Service
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/services/auth';

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
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  credentials = { email: '', password: '' };

  constructor() {
    addIcons({ mailOutline, lockClosedOutline });
  }

  async onLogin() {
    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    try {
      // 1. Wait for Firebase to finish
      const result = await this.authService.login(
        this.credentials.email,
        this.credentials.password
      );
      console.log('Login Successful:', result);

      await loading.dismiss();

      // 2. Navigate immediately after success
      // Using navigateByUrl is often more reliable for the first hop
      this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (e: any) {
      await loading.dismiss();
      console.error('Login Error:', e);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: e.message,
        buttons: ['OK'],
      });
      await alert.present();
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

  goToSignIn(){
      this.router.navigateByUrl('/signup', { replaceUrl: true });
  }
}
