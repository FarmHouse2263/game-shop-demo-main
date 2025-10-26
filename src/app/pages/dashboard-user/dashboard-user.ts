import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, Timestamp } from '@angular/fire/firestore';
import { map, Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Game {
  id?: string;
  title: string;
  category: string;
  price?: number;
  description?: string;
  imageFilename?: string;
  imageUrl?: string;
  createdAt?: Date;
}

@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.html',
  styleUrls: ['./dashboard-user.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class DashboardUser implements OnInit {
  firestore = inject(Firestore);
  router = inject(Router);

  games$: Observable<Game[]>;

  // สำหรับค้นหา
  searchName$ = new BehaviorSubject<string>('');
  searchCategory$ = new BehaviorSubject<string>('');

  searchName = '';
  searchCategory = '';

  constructor() {
    const gamesCollection = collection(this.firestore, 'games');

    const allGames$ = collectionData(gamesCollection, { idField: 'id' }).pipe(
      map((games: any[]) => games.map(game => ({
        ...game,
        imageUrl: game.imageFilename
          ? `http://202.28.34.203:30000/upload/${game.imageFilename}`
          : null,
        createdAt: game.createdAt instanceof Timestamp
          ? game.createdAt.toDate()
          : new Date(game.createdAt)
      })))
    );

    // รวม filter
    this.games$ = combineLatest([allGames$, this.searchName$, this.searchCategory$]).pipe(
      map(([games, name, category]) => {
        return games.filter(game => {
          const matchesName = game.title.toLowerCase().includes(name.toLowerCase());
          const matchesCategory = category ? game.category === category : true;
          return matchesName && matchesCategory;
        });
      })
    );
  }

  ngOnInit(): void {}

  logout() {
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  onSearchNameChange(value: string) {
    this.searchName$.next(value);
  }

  onSearchCategoryChange(value: string) {
    this.searchCategory$.next(value);
  }

  goToGameDetail(id: string | undefined) {
  if (id) {
    this.router.navigate(['/game-detail', id]);
  }
}

}
