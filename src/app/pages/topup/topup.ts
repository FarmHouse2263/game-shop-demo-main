import { Component, inject, OnInit } from '@angular/core';
import { Firestore, doc, getDoc, updateDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.html',
  styleUrls: ['./topup.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TopUpComponent implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);

  user: any = { balance: 0, name: '' };
  profileUrl: string | null = null;
  amount: number = 0;
  presets = [50, 100, 200, 500, 1000];

  async ngOnInit() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      this.router.navigate(['/login']);
      return;
    }

    const userRef = doc(this.firestore, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      this.user = { id: docSnap.id, ...docSnap.data() };
      // ดึง profile image
      this.profileUrl = this.user.profileFilename
        ? `http://202.28.34.203:30000/upload/${this.user.profileFilename}`
        : 'assets/default-avatar.png';
    }
  }

  selectAmount(value: number) {
    this.amount = value;
  }

  async addMoney() {
    if (this.amount <= 0) {
      alert('กรุณาใส่จำนวนเงินที่ถูกต้อง');
      return;
    }

    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const newBalance = (this.user.balance || 0) + this.amount;
    await updateDoc(doc(this.firestore, 'users', userId), { balance: newBalance });

    // บันทึกประวัติเติมเงิน
    await setDoc(doc(this.firestore, 'topups', `${userId}_${Date.now()}`), {
      userId,
      amount: this.amount,
      createdAt: new Date(),
    });

    this.user.balance = newBalance;
    this.amount = 0;
    alert('เติมเงินสำเร็จ!');
  }
}
