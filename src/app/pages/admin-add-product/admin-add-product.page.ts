import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { addIcons } from 'ionicons';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonBackButton,
  IonRow,
  IonCol,
  ToastController,
  IonIcon,
  LoadingController,
} from '@ionic/angular/standalone';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage'; // Add these imports
import { cloudUploadOutline } from 'ionicons/icons';
@Component({
  selector: 'app-admin-add-product',
  templateUrl: './admin-add-product.page.html',
  styleUrls: ['./admin-add-product.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    IonRow,
    IonCol,
    // IonIcon,
  ],
})
export class AdminAddProductPage implements OnInit {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  // Default product structure
  product = {
    name: '',
    imageUrl: '',
    actualPrice: null,
    offerPrice: null,
    category: 'OTT', // Default category
  };
  constructor() {
    addIcons({ cloudUploadOutline });
  }

  ngOnInit() {}

  async saveProduct() {
    // Basic validation to ensure fields aren't empty
    if (!this.product.name || !this.product.offerPrice) {
      this.presentToast('Please enter Name and Offer Price', 'warning');
      return;
    }

    try {
      const productRef = collection(this.firestore, 'products');

      await addDoc(productRef, {
        ...this.product,
        createdAt: serverTimestamp(), // Tracks when it was added
      });

      this.presentToast('Subscription Published Successfully!', 'success');

      // Go back to the dashboard after saving
      this.router.navigateByUrl('/admin-dashboard', { replaceUrl: true });
    } catch (error) {
      console.error('Error adding product: ', error);
      this.presentToast('Failed to save product', 'danger');
    }
  }

  // Smooth notification helper
  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }

  async uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Show loading while uploading
    const loading = await this.loadingCtrl.create({
      message: 'Uploading Image...',
    });
    await loading.present();

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the URL and save it to our product object
      this.product.imageUrl = await getDownloadURL(storageRef);

      await loading.dismiss();
      this.presentToast('Image uploaded successfully!', 'success');
    } catch (error) {
      await loading.dismiss();
      this.presentToast('Upload failed', 'danger');
      console.error(error);
    }
  }
}
