import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonCardContent,
} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
// 1. Add personCircleOutline to this import list
import { logoWhatsapp, mailOutline, bulbOutline, logoTwitter } from 'ionicons/icons';
@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    // IonHeader,
    // IonToolbar,
    // IonTitle,
    IonContent,
    // ExploreContainerComponent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
    IonCardContent,
  ],
})
export class Tab3Page {
  team: any = [
    {
      name: 'Makkam Santosh Kumar',
      role: 'Founder',
      photo: 'assets/img/team/sarah.jpg',
    },
  ];
  constructor() {
    addIcons({ mailOutline, bulbOutline,logoWhatsapp,logoTwitter });
  }
}
