import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(private firestore: Firestore, private router: Router) {}

  async login() {
  this.errorMessage = '';
  this.successMessage = '';

  if (!this.email.trim() || !this.password) {
    this.errorMessage = 'กรุณากรอก email และ password';
    return;
  }

  this.loading = true;

  try {
    const userDocRef = doc(this.firestore, 'users', this.email.toLowerCase());
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      this.errorMessage = 'ไม่พบผู้ใช้งานนี้';
      return;
    }

    const userData: any = userSnap.data();

    if (userData.password !== this.password) {
      this.errorMessage = 'รหัสผ่านไม่ถูกต้อง';
      return;
    }

    // ✅ เก็บ userId (คือ id ของ document ผู้ใช้)
    sessionStorage.setItem('userId', userSnap.id);

    // ✅ เก็บข้อมูลผู้ใช้ทั่วไป
    localStorage.setItem(
      'user',
      JSON.stringify({
        email: userData.email,
        name: userData.name,
        tel: userData.tel,
        address: userData.address,
        profileFilename: userData.profileFilename,
        role: userData.role,
      })
    );

    const roleName =
      userData.role === 'admin'
        ? 'ผู้ดูแลระบบ (Admin)'
        : 'ผู้ใช้ทั่วไป (User)';
    this.successMessage = `เข้าสู่ระบบสำเร็จ! คุณคือ ${roleName}`;

    setTimeout(() => {
      if (userData.role === 'admin') {
        this.router.navigate(['/dashboardadmin']);
      } else if (userData.role === 'user') {
        this.router.navigate(['/dashboarduser']);
      } else {
        this.router.navigate(['/']);
      }
    }, 2000);
  } catch (error) {
    console.error(error);
    this.errorMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่';
  } finally {
    this.loading = false;
  }
}

}
