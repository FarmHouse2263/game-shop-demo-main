import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-game',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-game.html',
  styleUrls: ['./add-game.scss'],
})
export class AddGame implements OnInit {
  firestore = inject(Firestore);
  http = inject(HttpClient);
  router = inject(Router);

  // ฟิลด์เกม
  title: string = '';
  price: number | null = null;
  category: string = '';
  description: string = '';
  imageUrl: string | null = null; // preview
  selectedFile: File | null = null;

  // สำหรับแก้ไขเกม
  gameId: string | null = null;

  ngOnInit() {
    // ตรวจสอบว่าเข้ามาแก้ไขหรือไม่ (ผ่าน router state)
    const state = history.state as { gameId?: string };
    if (state && state.gameId) {
      this.gameId = state.gameId;
      this.loadGame(this.gameId);
    }
  }

  // โหลดข้อมูลเกมเพื่อแก้ไข
  async loadGame(id: string) {
    const gameRef = doc(this.firestore, 'games', id);
    const snap = await getDoc(gameRef);
    if (snap.exists()) {
      const data: any = snap.data();
      this.title = data.title || '';
      this.price = data.price || null;
      this.category = data.category || '';
      this.description = data.description || '';
      if (data.imageFilename) {
        this.imageUrl = `http://202.28.34.203:30000/upload/${data.imageFilename}`;
      }
    }
  }

  // เลือกรูป
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    this.imageUrl = URL.createObjectURL(file);
  }

  // บันทึกเกม (เพิ่ม/แก้ไข)
  async saveGame() {
    if (!this.title || !this.price || !this.category) {
      alert('กรุณากรอกข้อมูลเกมทั้งหมด');
      return;
    }

    let uploadedFileName = '';

    if (this.selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        const uploadUrl = 'http://202.28.34.203:30000/upload';
        const res: any = await this.http.post(uploadUrl, formData).toPromise();
        uploadedFileName = res.filename || '';
      } catch (err) {
        console.error('❌ Upload Error:', err);
        alert('❌ อัปโหลดรูปไม่สำเร็จ');
        return;
      }
    }

    // ถ้าเป็นแก้ไขใช้ gameId เดิม, ถ้าเพิ่มใหม่ใช้ title เป็น ID
    const id = this.gameId
      ? this.gameId
      : this.title.replace(/\s+/g, '-').toLowerCase();
    const gameRef = doc(this.firestore, 'games', id);

    await setDoc(gameRef, {
      title: this.title,
      price: this.price,
      category: this.category,
      description: this.description,
      imageFilename: uploadedFileName || undefined,
      createdAt: new Date(),
    });

    alert(`✅ ${this.gameId ? 'แก้ไขเกม' : 'เพิ่มเกม'} สำเร็จ!`);
    this.resetForm();
    this.router.navigate(['/dashboardadmin']);
  }

  // รีเซ็ตฟอร์ม
  resetForm() {
    this.title = '';
    this.price = null;
    this.category = '';
    this.description = '';
    this.imageUrl = null;
    this.selectedFile = null;
    this.gameId = null;
  }

  // ยกเลิกและกลับไปหน้า Dashboard
  cancelGame() {
    this.router.navigate(['/dashboardadmin']);
  }
}
