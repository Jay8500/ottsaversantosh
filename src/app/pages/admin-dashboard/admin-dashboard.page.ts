import {
  Component,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import {
  Firestore,
  collection,
  collectionData,
  deleteDoc,
  doc,
  addDoc,
} from '@angular/fire/firestore';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

// Icon Imports
import { addIcons } from 'ionicons';
import { addOutline, logOutOutline, timeOutline, trash } from 'ionicons/icons';
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonThumbnail,
  IonIcon,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonButton,
  IonButtons,
  IonNote,
  IonModal,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.page.html',
  styleUrls: ['./admin-dashboard.page.scss'],
  imports: [
    CommonModule,
    AsyncPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonThumbnail,
    IonIcon,
    IonLabel,
    IonButton,
    IonButtons,
    IonNote,
    IonModal,
  ],
})
export class AdminDashboardPage {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private router = inject(Router);
  private alertCtrl = inject(AlertController);
  private injector = inject(EnvironmentInjector); // Required to fix the Injection Context warning

  // Observables for data streams
  products$: Observable<any[]>;
  history$: Observable<any[]>;
  userCount$: Observable<number>;

  constructor() {
    // Register Icons
    addIcons({ timeOutline, logOutOutline, addOutline, trash });

    // Initialize streams with Injection Context protection
    const user$ = authState(this.auth);

    this.products$ = user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        // This wrapper prevents the "Outside Injection Context" warning
        return runInInjectionContext(this.injector, () => {
          const ref = collection(this.firestore, 'products');
          return collectionData(ref, { idField: 'id' });
        });
      }),
      catchError(() => of([]))
    );

    this.history$ = user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        return runInInjectionContext(this.injector, () => {
          const ref = collection(this.firestore, 'deleted_products');
          return collectionData(ref, { idField: 'id' });
        });
      }),
      catchError(() => of([]))
    );

    this.userCount$ = user$.pipe(
      switchMap((user) => {
        if (!user) return of(0);
        return runInInjectionContext(this.injector, () => {
          const ref = collection(this.firestore, 'users');
          return collectionData(ref).pipe(map((users) => users.length));
        });
      }),
      catchError(() => of(0))
    );
  }

  // --- HTML Event Methods ---

  async handleLogout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  goToAddProduct() {
    this.router.navigateByUrl('/admin-add-product');
  }

  async confirmDelete(product: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${product.name}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => this.deleteProduct(product),
        },
      ],
    });
    await alert.present();
  }

  private async deleteProduct(product: any) {
    try {
      // 1. Add to history
      const historyRef = collection(this.firestore, 'deleted_products');
      await addDoc(historyRef, {
        ...product,
        deletedAt: new Date(),
      });

      // 2. Remove from active products
      const productDoc = doc(this.firestore, `products/${product.id}`);
      await deleteDoc(productDoc);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}
