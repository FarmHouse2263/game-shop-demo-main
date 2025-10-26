import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, orderBy, where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-history.html',
  styleUrls: ['./admin-history.scss']
})
export class AdminHistoryComponent implements OnInit {
  firestore = inject(Firestore);

  users: any[] = []; // เก็บรายชื่อผู้ใช้
  
  selectedUserId: string | null = null;

  topupHistory: any[] = [];
  purchaseHistory: any[] = [];
allTransactions: any[] = [];

  async ngOnInit() {
    // ดึงรายชื่อผู้ใช้ทั้งหมด
    const usersCol = collection(this.firestore, 'users');
    const usersSnap = await getDocs(usersCol);
    this.users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async selectUser(userId: string) {
    this.selectedUserId = userId;

    // ดึงประวัติการเติมเงิน
    const topupCol = collection(this.firestore, 'topups');
    const topupQuery = query(topupCol, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const topupSnap = await getDocs(topupQuery);
    this.topupHistory = topupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // ดึงประวัติการซื้อเกม
    const purchaseCol = collection(this.firestore, 'purchases');
    const purchaseQuery = query(purchaseCol, where('userId', '==', userId), orderBy('purchasedAt', 'desc'));
    const purchaseSnap = await getDocs(purchaseQuery);
    this.purchaseHistory = purchaseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
