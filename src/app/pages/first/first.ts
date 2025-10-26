import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- เพิ่มตรงนี้
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';

interface Game {
  id?: string;
  title: string;
  imageFilename?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-first',
  standalone: true, // ต้องระบุเพราะเป็น standalone
  imports: [CommonModule], // <-- เพิ่มตรงนี้
  templateUrl: './first.html',
  styleUrls: ['./first.scss']
})
export class First implements OnInit {
  firestore = inject(Firestore);
  games$!: Observable<Game[]>; // ใช้ ! เพราะกำหนดค่าใน ngOnInit
  gamesCollection = collection(this.firestore, 'games');

  ngOnInit() {
    this.games$ = collectionData(this.gamesCollection, { idField: 'id' }).pipe(
      map((games: any[]) => games.map(game => ({
        ...game,
        imageUrl: game.imageFilename
          ? `http://202.28.34.203:30000/upload/${game.imageFilename}`
          : 'assets/images/default-game.png'
      })))
    );
  }
}
