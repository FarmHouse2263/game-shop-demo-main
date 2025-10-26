import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Profile implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);

  user: any = { name: '', email: '', tel: '', address: '', balance: 0 };
  profileUrl: string | null = null;

  ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('ยังไม่ได้เข้าสู่ระบบ! กลับไปหน้า Login');
      this.router.navigate(['/login']);
      return;
    }

    const userRef = doc(this.firestore, 'users', userId);
    getDoc(userRef).then(snapshot => {
      if (snapshot.exists()) {
        this.user = snapshot.data();
        // ถ้ามีรูป profile
        if (this.user.profileFilename) {
          this.profileUrl = `http://202.28.34.203:30000/upload/${this.user.profileFilename}`;
        }
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboarduser']);
  }

  goToTopUp() {
    this.router.navigate(['/topup']);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileUrl = URL.createObjectURL(file);
      this.user.profileFilename = file.name; // กรณีจะเก็บชื่อไฟล์ใน Firestore
    }
  }

  async saveProfile() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const userRef = doc(this.firestore, 'users', userId);
    await updateDoc(userRef, this.user);
    alert('อัปเดตข้อมูลสำเร็จแล้ว!');
  }

  goToHistory() {
  this.router.navigate(['/history']);
}

purchasedGames: any[] = [];


async loadPurchasedGames(userId: string) {
  const purchaseCol = collection(this.firestore, 'purchases');
  const purchaseQuery = query(
    purchaseCol,
    where('userId', '==', userId),
    orderBy('purchasedAt', 'desc')
  );
  const purchaseSnap = await getDocs(purchaseQuery);
  this.purchasedGames = purchaseSnap.docs.map(doc => doc.data());
}

 logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

}
