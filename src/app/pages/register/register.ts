import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  firestore = inject(Firestore);
  http = inject(HttpClient);

  name = '';
  email = '';
  password = '';
  tel = '';
  address = '';
  role = 'user';
  profileUrl: string | null = null; // สำหรับ preview
  selectedFile: File | null = null; // เก็บไฟล์จริง


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.profileUrl = URL.createObjectURL(file); // preview ทันที
  }


  async register() {
    if (!this.email || !this.password) {
      alert('กรุณากรอก email และ password');
      return;
    }

    const userDocRef = doc(this.firestore, 'users', this.email.toLowerCase());
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      alert('อีเมลนี้ถูกใช้งานแล้ว');
      return;
    }

    let uploadedFileName = '';

    if (this.selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const uploadUrl = 'http://202.28.34.203:30000/upload';
        const res: any = await this.http.post(uploadUrl, formData).toPromise();

        console.log('📂 API Response:', res);
        uploadedFileName = res.filename || ''; // สมมติ API คืนค่า filename
      } catch (err) {
        console.error('❌ Upload Error:', err);
        alert('❌ อัปโหลดรูปไม่สำเร็จ');
      }
    }


    await setDoc(userDocRef, {
      name: this.name,
      email: this.email,
      password: this.password,
      tel: this.tel,
      address: this.address,
      profileFilename: uploadedFileName,
      role: this.role,
      createdAt: new Date()
    });

    alert('✅ สมัครสมาชิกสำเร็จ!');
    this.name = this.email = this.password = this.tel = this.address = '';
    this.profileUrl = null;
    this.selectedFile = null;
  }
}
