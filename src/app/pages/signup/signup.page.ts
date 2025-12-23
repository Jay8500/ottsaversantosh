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
  credentials = { email: 'j@gmail.com', password: 'qwertyuiop',
     name : "jay" };

async onSignup() {
  try {
    // Part 1: Create Auth User
    const credential = await this.authService.register(this.credentials.email, this.credentials.password);
    const uid = credential.user.uid;
    console.log('Auth success! UID:', uid);

    // Part 2: Create Firestore Document
    const userDocRef = doc(this.firestore, `users/${uid}`); // This creates the 'users' collection automatically
    await setDoc(userDocRef, {
      email: this.credentials.email,
      uid: uid,
      createdAt: new Date(),
      name :this.credentials.name 
    });

    console.log('Firestore document created!');
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });

  } catch (error) {
    console.error('Error during signup process:', error);
  }
} 
}
