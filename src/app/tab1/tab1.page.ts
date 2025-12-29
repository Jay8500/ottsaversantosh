import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, tap } from 'rxjs';
import { addIcons } from 'ionicons';
import { logoWhatsapp } from 'ionicons/icons';
// import { lastValueFrom } from 'rxjs';                  // <-- for async/await
// import { HttpClient } from '@angular/common/http';
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
    // IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonSkeletonText,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    // IonCardSubtitle,
    CommonModule,
  ],
  styleUrls: ['tab1.page.scss'],
  standalone: true,
})
export class Tab1Page implements OnInit {
  private firestore = inject(Firestore);
  public ottAdvInfo: OttInfo[] = [];
  public isLoading = true;
  // Use an Observable for real-time data
  public products$: Observable<any[]> | undefined;
  constructor() {
    addIcons({ logoWhatsapp });
  }
  async ngOnInit() {
    await this.getOttAdvInfo();
  }

  async getOttAdvInfo() {
    this.isLoading = true; // show skeletons
    this.ottAdvInfo = [];
    try {
      const productRef = collection(this.firestore, 'products');

      // collectionData automatically updates when Firestore changes
      this.products$ = collectionData(productRef, { idField: 'id' }).pipe(
        tap(() => {
          this.isLoading = false; // Turn off skeletons once data arrives
        })
      );

      this.isLoading = false; // hide skeletons
    } catch (err) {
      // console.error('Failed to load OTT plans', err);
    } finally {
      this.isLoading = false; // hide skeletons
    }
  }

  onEnquiryClick(product: any) {
    // You can link this to WhatsApp later
    // console.log('Enquiring about:', product.name);
    const phoneNumber = '917780199188'; // Replace with your friend's WhatsApp number (with 91)
    const message = `Hi, I am interested in buying the ${product.name} subscription for ₹${product.offerPrice}. Please guide me on how to pay.`;

    // Encode the message for a URL
    const encodedMessage = encodeURIComponent(message);

    // Create the WhatsApp link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open the link in a new window/app
    window.open(whatsappUrl, '_system');
  }
}
