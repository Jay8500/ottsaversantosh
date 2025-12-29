import { Component, OnInit } from '@angular/core';
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
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
// 1. Add personCircleOutline to this import list
import { calendarOutline, settingsOutline, timeOutline } from 'ionicons/icons';
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
    IonCard,
    IonCardHeader,
    IonList,
    IonLabel,
    IonIcon,
    IonItem,
    IonCardTitle,
  ],
})
export class ProfilePage implements OnInit {
  constructor() {
    addIcons({ settingsOutline,calendarOutline,timeOutline });
  }
  ngOnInit() {}
}
