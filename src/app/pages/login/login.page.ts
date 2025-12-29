import { Component, inject } from '@angular/core';
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
  private firestore = inject(Firestore); // 2. Inject Firestore

  credentials = { email: '', password: '' };

  constructor() {
    addIcons({ mailOutline, lockClosedOutline });
  }

  async onLogin() {
    const loading = await this.loadingCtrl.create({ message: 'Logging in...' });
    await loading.present();

    try {
      // Step 1: Login to Firebase Auth
      const result = await this.authService.login(
        this.credentials.email,
        this.credentials.password
      );
      const uid = result.user.uid;

      // Step 2: Fetch the Role from Firestore
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userSnap = await getDoc(userDocRef);

      await loading.dismiss();

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData['role'];

        console.log('User Role found:', role);

        // Step 3: Redirect based on Role
        if (role === 'admin') {
          // Send your friend to the Admin Dashboard
          this.router.navigateByUrl('/admin-dashboard', { replaceUrl: true });
        } else {
          // Send customers to the regular app
          this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
        }
      } else {
        // Fallback if no Firestore doc exists yet
        this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      }
    } catch (e: any) {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Login Failed',
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

  goToSignIn() {
    this.router.navigateByUrl('/signup', { replaceUrl: true });
  }
}
