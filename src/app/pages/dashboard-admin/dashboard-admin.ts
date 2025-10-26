import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Firestore, collectionData, collection, doc, deleteDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

interface Game {
  id?: string;
  title: string;
  price: number;
  category: string;
  description: string;
  imageFilename?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin.html',
  styleUrls: ['./dashboard-admin.scss']
})
export class DashboardAdmin implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);

  games$: Observable<Game[]>;
  gamesCollection = collection(this.firestore, 'games');

  constructor() {
    this.games$ = collectionData(this.gamesCollection, { idField: 'id' }).pipe(
      map((games: any[]) => games.map(game => ({
        ...game,
        imageUrl: game.imageFilename
          ? `http://202.28.34.203:30000/upload/${game.imageFilename}`
          : null
      })))
    );
  }

  ngOnInit(): void {}

  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  async deleteGame(game: Game) {
  if (!game.id) return;

  const confirmDelete = confirm(`คุณแน่ใจหรือไม่ที่จะลบเกม "${game.title}"?`);
  if (!confirmDelete) return;

  try {
    const gameRef = doc(this.firestore, 'games', game.id);
    await deleteDoc(gameRef);
    alert('✅ ลบเกมเรียบร้อยแล้ว');
  } catch (err) {
    console.error(err);
    alert('❌ ลบเกมไม่สำเร็จ');
  }
}

editGame(game: Game) {
  // ส่งไปหน้า EditGame พร้อม id สำหรับแก้ไข
  if (!game.id) return;
  this.router.navigate(['/dashboardadmin/edit-game', game.id ]);
}

 goToHistoryAdmin() {
    this.router.navigate(['/history-admin']);
  }

}
