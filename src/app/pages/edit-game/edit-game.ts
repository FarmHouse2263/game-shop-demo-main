import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './edit-game.html',
  styleUrls: ['./edit-game.scss']
})
export class EditGame implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);
  http = inject(HttpClient);

  gameId: string | null = null;
  game: any = {};
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  loading: boolean = true; // ✅ เพิ่มตรงนี้

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    // this.gameId = nav?.extras?.state?.['gameId'] || null; 
    this.gameId = this.route.snapshot.paramMap.get('id'); // รับ id จากพารามิเตอร์ URL

    if (this.gameId) {
      const gameRef = doc(this.firestore, 'games', this.gameId);
      getDoc(gameRef).then(snap => {
        if (snap.exists()) {
          this.game = snap.data();
          this.imageUrl = this.game.imageFilename
            ? `http://202.28.34.203:30000/upload/${this.game.imageFilename}`
            : null;
        } else {
          alert('ไม่พบข้อมูลเกม');
          this.router.navigate(['/dashboardadmin']);
        }
      }).finally(() => {
        this.loading = false; // ✅ โหลดเสร็จแล้ว
      });
    } else {
      alert('ไม่พบรหัสเกม');
      this.router.navigate(['/dashboardadmin']);
      this.loading = false;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;
    this.imageUrl = URL.createObjectURL(file);
  }

  async saveGame() {
    if (!this.game.title) {
      alert('กรุณากรอกชื่อเกม');
      return;
    }

    let uploadedFileName = this.game.imageFilename || '';

    if (this.selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        const res: any = await this.http.post('http://202.28.34.203:30000/upload', formData).toPromise();
        uploadedFileName = res.filename || uploadedFileName;
      } catch (err) {
        console.error(err);
        alert('❌ อัปโหลดรูปไม่สำเร็จ');
        return;
      }
    }

    if (this.gameId) {
      const gameRef = doc(this.firestore, 'games', this.gameId);
      await setDoc(gameRef, { ...this.game, imageFilename: uploadedFileName }, { merge: true });
      alert('✅ แก้ไขเกมเรียบร้อยแล้ว');
      this.router.navigate(['/dashboardadmin']);
    }
  }
}
