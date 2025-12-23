import { Component, inject } from '@angular/core';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // For logout navigation
import { AuthService } from '../services/auth'; // Adjust path as needed

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  trashOutline,
  cardOutline,
  personCircleOutline,
  logOutOutline,
} from 'ionicons/icons';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    // IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    // IonButtons,
    // IonCard,
    // IonCardHeader,
    // IonCardTitle,
    // IonCardSubtitle,
    // IonCardContent
  ],
})
export class Tab1Page {
  // 1. Inject services
  public authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  ottAdvInfo = [
    {
      id: 1,
      title: 'Netflix Bundle',
      subTitle: 'Save 20%',
      content: 'Premium 4K plan with friends.',
    },
    {
      id: 2,
      title: 'Disney+ Trio',
      subTitle: 'Hot Deal',
      content: 'Includes Hulu and ESPN.',
    },
  ];

  constructor() {
    // 2. Add icons to the registry
    addIcons({
      cartOutline,
      trashOutline,
      cardOutline,
      personCircleOutline,
      logOutOutline,
    });
  }

  // 3. Add Logout method
  async onLogout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  onEnquiryClick(info: any) {
    console.log('Clicked enquiry for:', info.title);
  }
}
