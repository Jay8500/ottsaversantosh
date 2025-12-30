import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Preferences } from '@capacitor/preferences'; // For persistent login
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  ToastController,
  LoadingController,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personOutline } from 'ionicons/icons';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // RouterLink,
    IonContent,
    // IonHeader,
    // IonTitle,
    // IonToolbar,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    // IonButtons,
    // IonBackButton,
    // IonLoading,
  ],
})
export class SignupPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private firestore = inject(Firestore);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  credentials = { email: '', password: '', name: '' };

  constructor() {
    addIcons({ mailOutline, lockClosedOutline, personOutline });
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
    });
    await toast.present();
  }

  async onSignup() {
    // 1. Validation for ALL fields including Name
    if (
      !this.credentials.name.trim() ||
      !this.credentials.email.trim() ||
      !this.credentials.password.trim()
    ) {
      this.presentToast(
        'Please fill in your name, email, and password',
        'warning'
      );
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating account...',
    });
    await loading.present();

    try {
      const credential = await this.authService.register(
        this.credentials.email,
        this.credentials.password
      );
      const uid = credential.user.uid;
      const userRole =
        this.credentials.email === 'admin@gmail.com' ? 'admin' : 'customer';

      // 2. Save EVERYTHING to Firestore (including Name)
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, {
        uid: uid,
        name: this.credentials.name, // Saved from the input
        email: this.credentials.email,
        role: userRole,
        createdAt: new Date(),
      });

      // 3. Set persistent session
      await Preferences.set({ key: 'user_role', value: userRole });

      await loading.dismiss();
      this.presentToast(`Welcome, ${this.credentials.name}!`, 'success');

      // Route based on role
      const targetPath =
        userRole === 'admin' ? '/admin-dashboard' : '/tabs/tab1';
      this.router.navigateByUrl(targetPath, { replaceUrl: true });
    } catch (e: any) {
      await loading.dismiss();
      const errorString = JSON.stringify(e).toUpperCase();
      let msg = 'Signup failed. Please try again.';

      if (errorString.includes('EMAIL_EXISTS'))
        msg = 'This email is already in use.';

      this.presentToast(msg, 'danger');
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  scrollIntoView(event: any) {
    // Only trigger on mobile devices where the keyboard actually appears
    if (window.innerWidth < 768) {
      setTimeout(() => {
        const el = event.target as HTMLElement;
        // 'nearest' is less aggressive than 'center' and stops the jumping
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 400); // Slightly longer delay to allow keyboard to finish opening
    }
  }
}
