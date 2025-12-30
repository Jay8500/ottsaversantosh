import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// 1. Add personCircleOutline to this import list
import {
  calendarOutline,
  logOutOutline,
  settingsOutline,
  shieldCheckmarkOutline,
  timeOutline,
} from 'ionicons/icons';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    // IonCard,
    // IonCardHeader,
    IonSkeletonText,
    IonList,
    IonLabel,
    IonIcon,
    IonItem,
    // IonCardTitle,
  ],
})
export class ProfilePage implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  userData: any = null; // This will hold the name, email, and role
  constructor() {
    addIcons({
      settingsOutline,
      calendarOutline,
      timeOutline,
      shieldCheckmarkOutline,
      logOutOutline,
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    const user = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        this.userData = userSnap.data();
      } else {
        // Fallback if Firestore doc is missing
        this.userData = {
          name: 'OttSaver User',
          email: user.email,
          role: 'customer',
        };
      }
    }
  }
  async logout() {
    await this.auth.signOut();
    await Preferences.clear();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
