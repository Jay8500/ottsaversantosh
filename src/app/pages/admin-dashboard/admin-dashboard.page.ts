import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonRow,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import {
  addCircle,
  addOutline,
  logOutOutline,
  timeOutline,
  trash,
} from 'ionicons/icons';
import { AlertController, ToastController } from '@ionic/angular/standalone';
import { addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonTitle,
    IonIcon,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonItemSliding,
    IonThumbnail,
    IonItemOption,
    IonItemOptions,
    IonModal,
  ],
})
export class AdminDashboardPage implements OnInit {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private auth = inject(Auth);
  products$: Observable<any[]> | undefined;
  userCount: number = 0;
  history$: Observable<any[]> | undefined;
  constructor() {
    addIcons({ addOutline, trash, timeOutline, logOutOutline });
  }

  ngOnInit() {
    // 1. Get a stream of products to show in a list
    const productRef = collection(this.firestore, 'products');
    this.products$ = collectionData(productRef, { idField: 'id' });

    // 2. Get a stream of users to count them
    const userRef = collection(this.firestore, 'users');
    collectionData(userRef).subscribe((users) => {
      this.userCount = users.length;
    });
    this.history$ = collectionData(
      collection(this.firestore, 'deleted_products'),
      { idField: 'id' }
    );
  }

  goToAddProduct() {
    this.router.navigateByUrl('/admin-add-product');
  }

  async confirmDelete(product: any) {
    const alert = await this.alertCtrl.create({
      header: 'Archive Product?',
      message: `Do you want to remove ${product.name}? It will be moved to History.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.deleteAndTrack(product),
        },
      ],
    });
    await alert.present();
  }

  async deleteAndTrack(product: any) {
    try {
      // 1. Add to History (deleted_products)
      const historyRef = collection(this.firestore, 'deleted_products');
      await addDoc(historyRef, {
        ...product,
        deletedAt: serverTimestamp(),
      });

      // 2. Remove from active products
      const docRef = doc(this.firestore, `products/${product.id}`);
      await deleteDoc(docRef);

      const toast = await this.toastCtrl.create({
        message: 'Product moved to History',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    } catch (e) {
      console.error(e);
    }
  }

  async handleLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Logout',
      message: 'Are you sure you want to sign out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Logout',
          cssClass: 'alert-danger',
          handler: async () => {
            await signOut(this.auth);
            this.router.navigateByUrl('/login', { replaceUrl: true });
          },
        },
      ],
    });

    await alert.present();
  }
}
