import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonLoading,
} from '@ionic/angular/standalone';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'; // 1. Add these

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
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    // IonLoading,
  ],
})
export class SignupPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private firestore = inject(Firestore); // 2. Inject Firestore
  credentials = { email: 'j@gmail.com', password: 'qwertyuiop', name: 'jay' };

  async onSignup() {
    try {
      // Part 1: Create Auth User via your AuthService
      const credential = await this.authService.register(
        this.credentials.email,
        this.credentials.password
      );
      const uid = credential.user.uid;

      // Part 2: Determine Role
      // If it's your friend's email, make them admin. Otherwise, customer.
      const userRole =
        this.credentials.email === 'admin@gmail.com' ? 'admin' : 'customer';

      // Part 3: Create Firestore Document with Role
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, {
        uid: uid,
        email: this.credentials.email,
        name: this.credentials.name,
        role: userRole, // <--- THIS IS THE KEY ADDITION
        createdAt: new Date(),
      });

      console.log(`Firestore profile created with role: ${userRole}`);

      // Part 4: Route based on role
      if (userRole === 'admin') {
        this.router.navigateByUrl('/admin-dashboard');
      } else {
        this.router.navigateByUrl('/tabs/tab1');
      }
    } catch (error) {
      console.error('Error during signup process:', error);
    }
  }
}
