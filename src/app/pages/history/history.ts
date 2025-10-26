import { Component, inject, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.scss'],
})
export class History implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);

  topupHistory: any[] = [];
  purchaseHistory: any[] = [];

  async ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('กรุณาเข้าสู่ระบบก่อนดูประวัติ');
      this.router.navigate(['/login']);
      return;
    }

    // ดึงประวัติการเติมเงิน
    const topupCol = collection(this.firestore, 'topups');
    const topupQuery = query(
      topupCol,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const topupSnap = await getDocs(topupQuery);
    this.topupHistory = topupSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ดึงประวัติการซื้อเกม
    const purchaseCol = collection(this.firestore, 'purchases');
    const purchaseQuery = query(
      purchaseCol,
      where('userId', '==', userId),
      orderBy('purchasedAt', 'desc')
    );  
    const purchaseSnap = await getDocs(purchaseQuery);
    console.log(
      'Purchase Snap Docs:',
      purchaseSnap.docs.map((doc) => doc.data())
    );
    this.purchaseHistory = purchaseSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  goBack() {
    this.router.navigate(['/profile']);
  }
}
