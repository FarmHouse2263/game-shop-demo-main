import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss'],
})
export class CartComponent implements OnInit {
  router = inject(Router);
  firestore = inject(Firestore);

  cart: any[] = [];
  user: any = { balance: 0 };

  ngOnInit(): void {
    this.loadCart();
    this.loadUser();
  }

  loadCart() {
    const data = localStorage.getItem('cart');
    if (data) {
      this.cart = JSON.parse(data).map((item: any) => ({
        ...item,
        imageUrl: item.imageFilename
          ? `http://202.28.34.203:30000/upload/${item.imageFilename}`
          : item.imageUrl,
        createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
      }));
    } else {
      this.cart = [];
    }
  }

  async loadUser() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const userRef = doc(this.firestore, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      this.user = snap.data();
    }
  }

  removeItem(id: string) {
    this.cart = this.cart.filter((item) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.price || 0), 0);
  }
  //คำนวนส่วนลด
  getDiscount(): number {
    const subtotal = this.getSubtotal();
    return subtotal > 0 ? Math.round(subtotal * 0.1) : 0;
  }

  getTotal(): number {
    return this.getSubtotal() - this.getDiscount();
  }

  async checkout() {
    const userId = sessionStorage.getItem('userId');
    if (!userId) return;

    const totalPrice = this.getTotal();
    const newBalance = this.user.balance - totalPrice;

    await updateDoc(doc(this.firestore, 'users', userId), {
      balance: newBalance,
    });

    // บันทึกประวัติการซื้อเกม
    for (let item of this.cart) {
      await setDoc(
        doc(this.firestore, 'purchases', `${userId}_${item.id}_${Date.now()}`),
        {
          userId,
          gameId: item.id,
          gameTitle: item.title,
          price: item.price,
          purchasedAt: serverTimestamp(),
        }
      );
    }

    this.user.balance = newBalance;
    alert(`ซื้อเกมเรียบร้อย! ยอดเงินคงเหลือ ${newBalance} บาท`);
    this.cart = [];
    localStorage.removeItem('cart');
  }

  goToShop() {
    this.router.navigate(['/dashboarduser']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
