import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonSkeletonText,
  IonBadge,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  Firestore,
  collection,
  collectionData,
  query,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { addIcons } from 'ionicons';
import { logoWhatsapp, personCircleOutline } from 'ionicons/icons';
// import { lastValueFrom } from 'rxjs';                  // <-- for async/await
// import { HttpClient } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth'; // Add Auth to imports
import { doc, getDoc } from 'firebase/firestore';
interface OttInfo {
  id?: number;
  img: string;
  title: string;
  subTitle: string;
  content: string;
}
// import { person } from 'ionicons/icons';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    RouterModule,
    IonButton,
    IonIcon,
    IonCard,
    IonSkeletonText,
    IonCardHeader,
    IonCardContent,
    IonBadge,
    IonCardTitle,
    IonButton,
    IonButtons,
    // IonCardSubtitle,
    CommonModule,
  ],
  styleUrls: ['tab1.page.scss'],
  standalone: true,
})
export class Tab1Page {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  public ottAdvInfo: OttInfo[] = [];
  public isLoading = true;
  // Use an Observable for real-time data
  public products$: Observable<any[]>;
  public userName: string = 'Guest'; // Default value
  constructor() {
    addIcons({ logoWhatsapp, personCircleOutline });
    this.loadUserProfile();
    const productRef = collection(this.firestore, 'products');

    // We create the observable directly
    this.products$ = collectionData(productRef, { idField: 'id' }).pipe(
      tap((data) => {
        if (data && data.length > 0) {
          this.isLoading = false; // This kills the skeletons
          // console.log('UI updated with items:', data.length);
        }
      })
    );

    // Keep this small logic to handle the "Empty" case quickly
    getDocs(productRef).then((snap) => {
      if (snap.empty) {
        this.isLoading = false;
      }
    });
  }
  userData: any = null; //
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
  onEnquiryClick(product: any) {
    // You can link this to WhatsApp later
    //
    // .log('Enquiring about:', product.name);
    const phoneNumber = '917780199188'; // Replace with your friend's WhatsApp number (with 91)
    const message =
      `*New Inquiry from OttSaver* 🚀\n\n` +
      `Plan: *${product.name}*\n` +
      `Offer Price: ₹${product.offerPrice}\n` +
      `Actual Price: ₹${product.actualPrice}\n\n` +
      `Please send me the payment details!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_system');
  }
}
